using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace ApplicationStats
{
    public class StatsModule : IHttpModule
    {
        #region IHttpModule Members

        public void Dispose()
        {
            throw new NotImplementedException();
        }

        public void Init(HttpApplication context)
        {
            context.BeginRequest += InStatFilter;
            context.EndRequest += OutStatFilter;

        }

        public static void InStatFilter(object sender, EventArgs e)
        {
            HttpApplication app = (HttpApplication)sender;
            foreach (System.Reflection.PropertyInfo p in app.Request.GetType().GetProperties())
            {
                try
                {
                    HttpContext.Current.Response.Write(String.Format("{0} : {1}", p.Name, p.GetValue(app.Request, null)) + "<br>");
                }
                catch (Exception) { }
            }
            HttpContext.Current.Response.Write("<p/><br>Begining....</br>");
        }

        public static void OutStatFilter(object sender, EventArgs e)
        {
            HttpApplication app = (HttpApplication)sender;
            foreach (System.Reflection.PropertyInfo p in app.Response.GetType().GetProperties())
            {
                try
                {
                    HttpContext.Current.Response.Write(String.Format("{0} : {1}", p.Name, p.GetValue(app.Response, null)) + "<br>");
                }
                catch (Exception) { }
            }

            HttpContext.Current.Response.Write("<br>....Ending</br>");
        }

        #endregion
    }
}
