using System;
using System.Web; 
using System.Collections.Generic;


namespace StressToolCollector
{
    internal class RequesItem        
    {
        int startTicks;
        Proxy.ContentType contentType;
        Dictionary<string, Proxy.Cookie> cookie;
        List<Proxy.Header> headers;
        Proxy.Request reques;
        Proxy.Response response;

        RequesItem()
        {
            startTicks = Environment.TickCount;
        }

        public RequesItem(HttpRequest req)
        {
        }

        public int ExecuteMillis { get { return Environment.TickCount - startTicks; } }
    }
}
