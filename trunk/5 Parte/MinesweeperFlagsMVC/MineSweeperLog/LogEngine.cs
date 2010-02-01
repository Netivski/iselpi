using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Web;
using System.IO;
using System.Xml;
using System.Web.SessionState;

namespace MineSweeperLog
{
    public class LogEngine
    {        
        public static LogEngine Current;
        static LogEngine()
        {
            if (Current == null) Current = new LogEngine();
        }

        String appPath;         //Path to Log Folder under the application Folder
        XmlDocument _doc;       //XmlDocument used to persist Log
        FileStream _myStream;   //Stream used to write XML file
        Object mon;             //Monitor used to sinchronize Log file access
        LogExecutor _exec;      //Framework Executor
        //IDictionary<string, Delegate> _loggedCalls;

        LogEngine()
        {            
            mon = new object();
            _exec = new LogExecutor(20);
        }
        
        
        public void LogApplication(object application)
        {
            //if (application == null) throw new ArgumentNullException("LogEngine: ctx");
            if (application == null) return;
            _exec.Execute(InitLog, application);            
        }
        private void InitLog(object application)
        {
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

            //Cria o elemento raiz contendo informação do Registo de Log
            XmlElement root = _doc.CreateElement("Log");
            if (app.Context != null)
            {
                root.SetAttribute("TimeStamp", app.Context.Timestamp.ToString());
                if (app.Context.Request != null)
                    root.AppendChild(SerializeRequest(app.Context.Request));
                if (app.Context.Response != null)
                    root.AppendChild(SerializeResponse(app.Context.Response));
                if (app.Context.AllErrors != null && app.Context.AllErrors.Length > 0)
                {
                    XmlElement errorsElem = _doc.CreateElement("Errors");
                    for (Int32 i = 0; i < app.Context.AllErrors.Length; i++)
                    {
                        XmlElement error = _doc.CreateElement("Error");
                        error.SetAttribute("Message", app.Context.AllErrors[i].Message);
                        error.SetAttribute("Source", app.Context.AllErrors[i].Source);
                        errorsElem.AppendChild(error);
                    }
                    root.AppendChild(errorsElem);
                }
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
            try
            {
                if (app.Session != null)
                {
                    XmlElement sessionElem = _doc.CreateElement("Session");
                    sessionElem.SetAttribute("isCookieless", app.Session.IsCookieless.ToString());
                    sessionElem.SetAttribute("isNewSession", app.Session.IsNewSession.ToString());
                    sessionElem.SetAttribute("isReadOnly", app.Session.IsReadOnly.ToString());
                    sessionElem.SetAttribute("isSynchronized", app.Session.IsSynchronized.ToString());
                    if (app.Session.Keys.Count > 0)
                    {
                        XmlElement KeysElem = _doc.CreateElement("Keys");
                        for (Int32 i = 0; i < app.Session.Keys.Count; i++)
                        {
                            XmlElement key = _doc.CreateElement("key");
                            key.InnerText = app.Session.Keys[i];
                            KeysElem.AppendChild(key);
                        }
                        sessionElem.AppendChild(KeysElem);
                    }
                    sessionElem.SetAttribute("LCID", app.Session.LCID.ToString());
                    sessionElem.SetAttribute("SessionMode", app.Session.Mode.ToString());
                    sessionElem.SetAttribute("ID", app.Session.SessionID);
                    sessionElem.SetAttribute("Timeout", app.Session.Timeout.ToString());
                    root.AppendChild(sessionElem);
                }
            }
            catch (Exception) { }
            _doc.AppendChild(root);                
            
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
            if (req.QueryString.Count> 0)
            {
                XmlElement qs = _doc.CreateElement("QueryString");
                qs.SetAttribute("Count", req.QueryString.Count.ToString());
                for (int i = 0; i < req.QueryString.Count; i++)
                {
                    XmlElement paramElem = _doc.CreateElement(req.QueryString.Keys[i]);
                    paramElem.InnerText += req.QueryString[i];
                    qs.AppendChild(paramElem);
                }
                root.AppendChild(qs);
            }
            if(req.CurrentExecutionFilePath!= null)
                root.SetAttribute("Controller", req.CurrentExecutionFilePath);
            if (req.Browser != null)
                root.SetAttribute("Browser", req.Browser.Browser);
            if (req.Cookies.Count > 0)
            {
                XmlElement cookies = _doc.CreateElement("Cookies");
                cookies.SetAttribute("Count", req.Cookies.Count.ToString());
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < req.Cookies.Count; i++)
                {
                    sb.Append(req.Cookies[0].Name);
                    if (i < req.Cookies.Count - 1)
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
                    if (i < res.Cookies.Count - 1)
                        sb.Append(", ");
                }
                cookies.InnerText = sb.ToString();
                root.AppendChild(cookies);
            }
            if (res.Status != null)
                root.SetAttribute("Status", res.Status);

            if(res.Charset != null)
                root.SetAttribute("Charset", res.Charset);

            if (res.ContentEncoding != null)
                root.SetAttribute("ContentEncoding", res.ContentEncoding.WebName);
            
            return root;
        }
    }
}
