using System;
using System.IO;
using System.Threading;
using WebStressTool.Proxy;
using WebStressTool.HttpClient;


namespace WebStressTool
{
    internal class StressToolWorker
    {
        public EventHandler EndInvoke        = null;
        public EventHandler EndRequestInvoke = null;

        DirectoryInfo baseDirectory; 
        volatile int  requestCount;

        public StressToolWorker( DirectoryInfo baseDirectory  )
        {
            if (baseDirectory == null) throw new ArgumentNullException("baseDirectory");
            if (!baseDirectory.Exists) throw new ArgumentException("baseDirectory");

            this.baseDirectory = baseDirectory;
        }

        protected void OnEndInvoke()
        {
            if (EndInvoke != null) EndInvoke(this, null);
        }

        protected void OnEndRequestInvoke(object sender, EventArgs args)
        {
            EndRequestArgs eRequest = ((EndRequestArgs)args);
            eRequest.DataReader.Close();

            eRequest.DataWriter.Flush();
            eRequest.DataWriter.Close();

            if (EndRequestInvoke != null) EndRequestInvoke(this, new EndRequestEventArgs(eRequest.State));
        }


        void DoRequest( object requestItem )
        {
            RequestItem request = (RequestItem)requestItem;
            try
            {
                AsynchronousHttpClient ac = new AsynchronousHttpClient(request.RequestUrl, new StreamReader(request.SourceFilePath), new StreamWriter( request.DestinationFilePath ));
                ac.EndRequest += OnEndRequestInvoke;
                ac.DoRequest();
            }
            finally
            {
                System.Threading.Interlocked.Decrement(ref requestCount);
                if (requestCount == 0) OnEndInvoke();
            }
        }

        public void Invoke( int count )
        {
            FileInfo[] requestItems = baseDirectory.GetFiles("*.req");
            if (requestItems != null)
            {
                requestCount = requestItems.Length;
                foreach (FileInfo request in requestItems)
                    for (int i = 0; i < count; i++) 
                        ThreadPool.QueueUserWorkItem(DoRequest, new RequestItem(request, i));
            }
        }
    }
}
