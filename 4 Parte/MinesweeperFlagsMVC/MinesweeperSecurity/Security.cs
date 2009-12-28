using System;
using System.Web;
using System.Diagnostics;

namespace MinesweeperSecurity
{
    public class Security: IHttpModule
    {

        public Security() { }

        void OnAuthenticateRequest(object sender, EventArgs e)
        {
            if (sender == null) throw new ArgumentNullException("sender");
            HttpApplication context = (HttpApplication)sender;
        }

        void OnAuthorizeRequest(object sender, EventArgs e)
        {
            if (sender == null) throw new ArgumentNullException("sender");
            HttpApplication context = (HttpApplication)sender;
        }

        public void Init(HttpApplication ctx)
        {
            ctx.AuthenticateRequest += new EventHandler(OnAuthenticateRequest);
            ctx.AuthorizeRequest    += new EventHandler(OnAuthorizeRequest);            
        }

        public void Dispose(){ /* do nothing */ }
    }
}
