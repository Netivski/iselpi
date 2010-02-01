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
        #region IHttpModule Members

        public void Dispose()
        {   
            throw new NotImplementedException();
        }

        public void Init(HttpApplication app)
        {
            //app.BeginRequest += new EventHandler(app_BeginRequest);
            app.EndRequest += new EventHandler(app_EndRequest);         
            app.PreSendRequestContent += new EventHandler(app_PreSendRequestContent);
            
        }

        void app_PreSendRequestContent(object sender, EventArgs e)
        {
            HttpApplication app = (HttpApplication)sender;
            System.Diagnostics.StackTrace st = new StackTrace(Thread.CurrentThread, false);           
            StackFrame[] sfa = st.GetFrames();
            String s = null;
            for (int i = 0; i < sfa.Length; i++)
            {
                s += sfa[i].GetMethod().Name;
                if (i < sfa.Length - 1)
                    s += ", ";
            }
            String g = Environment.StackTrace;
            
        }
        void app_BeginRequest(object sender, EventArgs e)
        {
            if (sender == null) throw new ArgumentNullException("sender");
            LogEngine.Current.LogApplication((HttpApplication)sender);
        }
        void app_EndRequest(object sender, EventArgs e)
        {
            if (sender == null) throw new ArgumentNullException("sender");
            LogEngine.Current.LogApplication((HttpApplication)sender);
        }
        #endregion        
    }
}
