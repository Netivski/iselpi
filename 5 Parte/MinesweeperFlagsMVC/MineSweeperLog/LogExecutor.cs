using System;
using System.Collections.Generic;
using System.Threading;
using System.Runtime.CompilerServices;

namespace MineSweeperLog
{
    public interface Executor
    {
        void Execute(ParameterizedThreadStart task, Object args);
    }

    public class LogExecutor : Executor
    {
        private object mon;
        class Task
        {
            private ParameterizedThreadStart _th;
            private object _args;
            public Task(ParameterizedThreadStart th, object args)
            {
                _th = th;
                _args = args;
            }
            public ParameterizedThreadStart Th { get { return _th; } }
            public Object Args { get { return _args; } }
        }
        private readonly LinkedList<Task> tasks = new LinkedList<Task>();
        private readonly int MAX_THREADS;
        private int num_threads;
        private int waiting_threads;

        public LogExecutor(int max_threads)
        {
            mon = new object();
            MAX_THREADS = max_threads;
            num_threads = 0;
            waiting_threads = 0;
        }

        private void ThreadAction()
        {   
            while (true)
            {
                Task task;
                lock (mon)
                {
                    if (tasks.Count == 0)
                    {
                        ++waiting_threads;
                        try
                        {
                            int end_time = Environment.TickCount + 10000;
                            int remaining_time;
                            do
                            {
                                remaining_time = end_time - Environment.TickCount;
                                if (remaining_time <= 0)
                                {
                                    --num_threads;
                                    return;
                                }
                                Monitor.Wait(mon, remaining_time);
                            } while (tasks.Count == 0);
                        }
                        finally
                        {
                            --waiting_threads;
                        }
                    }
                    task = tasks.First.Value;
                    tasks.RemoveFirst();
                }
                task.Th(task.Args);
            }
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        public void Execute(ParameterizedThreadStart task, object args)
        {
            lock (mon)
            {
                tasks.AddLast(new Task(task, args));
                if (waiting_threads > 0)
                {
                    Monitor.Pulse(mon);
                }
                else
                {
                    if (num_threads < MAX_THREADS)
                    {
                        Thread t = new Thread(ThreadAction);
                        t.IsBackground = true;
                        ++num_threads;
                        t.Start();
                    }
                }
            }
        }
    }
}


