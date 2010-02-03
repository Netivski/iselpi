using System;
using System.IO;

namespace WebStressTool.Proxy
{
    internal class RequestItem
    {
        FileInfo requestFile;
        string   hostName;
        int      port;
        Uri      requestUrl = null;

        public RequestItem(FileInfo requestFile)
        {
            this.requestFile = requestFile;

            string[] aux = requestFile.Name.Split('_');
            hostName     = aux[1];
            port         = Convert.ToInt32( aux[2] );
        }

        public string HostName           { get { return hostName; } }
        public int    Port               { get { return port;     } }
        public string SourceFilePath     { get { return requestFile.FullName; } }
        public string DestinationFilePath{ get { return Path.Combine(Path.GetFileNameWithoutExtension(SourceFilePath), "resp"); }  }
        public Uri    RequestUrl
        {
            get
            {
                if (requestUrl != null) return requestUrl;

                return  requestUrl = new Uri(string.Format(@"http://{0}{1}{2}/", hostName, (port != 80 ? ":" : ""), (port != 80 ? port.ToString() : "")));                
            }
        }

    }
}
