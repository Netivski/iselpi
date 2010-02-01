using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Threading;
using System.Diagnostics;


namespace MineSweeperLog
{
    public class Log : IHttpModule
    {
        //StackTrace st;
        #region IHttpModule Members

        public void Dispose()
        {   
            throw new NotImplementedException();
        }

        public void Init(HttpApplication app)
        {
            //app.BeginRequest += new EventHandler(app_BeginRequest);
            app.EndRequest += new EventHandler(app_EndRequest);         
        }
        void app_BeginRequest(object sender, EventArgs e)
        {
            if (sender == null) throw new ArgumentNullException("sender");
            LogEngine.Current.LogApplication((HttpApplication)sender);
            //st = new StackTrace(Thread.CurrentThread, false);
        }
        void app_EndRequest(object sender, EventArgs e)
        {
            if (sender == null) throw new ArgumentNullException("sender");
            LogEngine.Current.LogApplication((HttpApplication)sender);
            //Try 1            
            //StackFrame[] sfa = st.GetFrames();
            //String s = null;
            //for (int i = 0; i < sfa.Length; i++)
            //{
            //    s += sfa[i].GetMethod().Name;
            //    if (i < sfa.Length - 1)
            //        s += ", ";
            //}            
            //It contains "only" the pipeline StackFrame
            //The Handler call is Asynchronous (IHttpAsyncHandler).... maybe if we caught MVCHandler call??...
        }
        #endregion        
    }
}
