using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Web;
using System.IO;
using System.Xml;

namespace MineSweeperLog
{
    public class LogEngine
    {
        private const Int32 MAX_THREADS = 10;
        public static LogEngine Current;
        static LogEngine()
        {
            if (Current == null) Current = new LogEngine();
        }

        String appPath;
        XmlDocument _doc;
        FileStream _myStream;
        Object mon;

        LogEngine()
        {            
            mon = new object();
        }
        
        
        public void LogApplication(object application)
        {
            //if (application == null) throw new ArgumentNullException("LogEngine: ctx");
            if (application == null) return;
            HttpApplication app = (HttpApplication)application;

            if (appPath == null && app.Context == null) return;

            if (appPath == null) SetAppPath(app.Context);

            SerializeApplication(app);
        }

        private void SetAppPath(HttpContext ctx)
        {
            if (!Directory.Exists(ctx.Server.MapPath("/Log")))
                Directory.CreateDirectory(ctx.Server.MapPath("/Log"));

            appPath = ctx.Server.MapPath("/Log");
        }

        private void SerializeApplication(HttpApplication app)
        {
            _doc = new XmlDocument();
            try
            {
                //Cria o elemento raiz contendo informação do Registo de Log
                XmlElement root = _doc.CreateElement("Log");
                if (app.Context != null)
                {
                    root.SetAttribute("TimeStamp", app.Context.Timestamp.ToString());
                    if (app.Context.Request != null)
                        root.AppendChild(SerializeRequest(app.Context.Request));
                    if (app.Context.Response != null)
                        root.AppendChild(SerializeResponse(app.Context.Response));
                }
                else
                {
                    root.SetAttribute("DateTime", DateTime.Now.ToString());
                    root.SetAttribute("Info", "No Context");

                    if (app.Request != null)
                        root.AppendChild(SerializeRequest(app.Request));
                    if (app.Response != null)
                        root.AppendChild(SerializeResponse(app.Response));
                }
                _doc.AppendChild(root);                
            }
            catch (Exception e) {
                XmlElement elemException = _doc.CreateElement("Excepção");
                elemException.InnerText = e.Message;
                _doc.AppendChild(elemException);             
            }
            lock (mon)
            {
                _myStream = File.Open(appPath + "/LogFile_" + DateTime.Today.ToShortDateString() + ".xml", FileMode.Append);
                _doc.Save(_myStream);
                _myStream.Close();
            }
        }

        private XmlElement SerializeRequest(HttpRequest req)
        {       
            XmlElement root = _doc.CreateElement("Request");
            if(req.HttpMethod != null)
                root.SetAttribute("Method", req.HttpMethod);
            if (req.Url != null)
                root.SetAttribute("Url", req.Url.ToString());
            if (req.QueryString != null)
            {
                XmlElement qs = _doc.CreateElement("QueryString");
                for (int i = 0; i < req.QueryString.Count; i++)
                {
                    qs.InnerText += req.QueryString[i];
                    if (i < req.QueryString.Count)
                        qs.InnerText += ", ";
                }
                root.AppendChild(qs);
            }
            if(req.CurrentExecutionFilePath!= null)
                root.SetAttribute("Controller", req.CurrentExecutionFilePath);
            if (req.Browser != null)
                root.SetAttribute("Browser", req.Browser.Browser);
            if (req.Cookies != null)
            {
                XmlElement cookies = _doc.CreateElement("Cookies");
                cookies.SetAttribute("Count", req.Cookies.Count.ToString());
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < req.Cookies.Count; i++)
                {
                    sb.Append(req.Cookies[0].Name);
                    if (i < req.Cookies.Count)
                        sb.Append(", ");
                }
                cookies.InnerText = sb.ToString();
                root.AppendChild(cookies);
            }
            if (req.ContentLength > 0)
            {
                XmlElement content = _doc.CreateElement("Content");
                content.SetAttribute("Length", req.ContentLength.ToString());
                content.SetAttribute("Type", req.ContentType);
                root.AppendChild(content);
            }
            return root;
        }
        private XmlElement SerializeResponse(HttpResponse res)
        {
            XmlElement root = _doc.CreateElement("Response");
            root.SetAttribute("ContentType", res.ContentType);
            if (res.Cookies.Count > 0)
            {
                XmlElement cookies = _doc.CreateElement("Cookies");
                cookies.SetAttribute("Count", res.Cookies.Count.ToString());
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < res.Cookies.Count; i++)
                {
                    sb.Append(res.Cookies[0].Name);
                    if (i < res.Cookies.Count)
                        sb.Append(", ");
                }
                cookies.InnerText = sb.ToString();
                root.AppendChild(cookies);
            }
            if (res.Status != null)
                root.SetAttribute("Status", res.Status);
            
            return root;
        }
    }
}
