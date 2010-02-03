﻿using System;
using System.Web;
using System.Diagnostics;
using System.Threading;
using System.IO;

namespace StressToolCollector
{
    public class Collector : IHttpModule
    {

        public Collector() { }

        string GetFilePath( Uri requestUrl )
        {
            string rValue = string.Format("{0}_{1}_{2}.req", DateTime.UtcNow.Ticks, requestUrl.Host, requestUrl.Port);

            return System.IO.Path.Combine(Environment.GetEnvironmentVariable("tmp"), rValue);
        }

        void BeginRequest(object sender, EventArgs e)
        {
            if (sender == null) throw new ArgumentNullException("sender");
            HttpApplication ctx = (HttpApplication)sender;

            ctx.Request.SaveAs(GetFilePath( ctx.Request.Url ), true); 
        }

        void EndRequest(object sender, EventArgs e)
        {
            if (sender == null) throw new ArgumentNullException("sender");
            HttpApplication context = (HttpApplication)sender;

        }

        public void Init(HttpApplication ctx)
        {
            ctx.BeginRequest += new EventHandler(BeginRequest);
            ctx.EndRequest   += new EventHandler(EndRequest);

        }

        public void Dispose() { /* do nothing */ }
    }
}