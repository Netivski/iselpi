using System;
using System.Web;
using System.Diagnostics;
using System.Threading;

namespace StressToolCollector
{
    public class Collector : IHttpModule
    {

        public Collector() { }

        void BeginRequest(object sender, EventArgs e)
        {
            if (sender == null) throw new ArgumentNullException("sender");
            HttpApplication ctx = (HttpApplication)sender;

            ctx.Request.SaveAs(string.Format(@"c:\temp\{0}.log", Guid.NewGuid()), true); 
        }

        void EndRequest(object sender, EventArgs e)
        {
            if (sender == null) throw new ArgumentNullException("sender");
            HttpApplication context = (HttpApplication)sender;

        }

        public void Init(HttpApplication ctx)
        {
            ctx.BeginRequest += new EventHandler(BeginRequest);
            ctx.EndRequest += new EventHandler(EndRequest);

        }

        public void Dispose() { /* do nothing */ }
    }
}
