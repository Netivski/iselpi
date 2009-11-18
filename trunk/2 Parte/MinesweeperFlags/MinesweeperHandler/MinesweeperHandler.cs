using System;
using System.Web;
using System.IO;

namespace MinesweeperHandler
{
    public class MinesweeperHandler: IHttpHandler
    {
        HttpContext ctx = null;

        public bool IsReusable
        {
            get { return true; }
        }

        protected HttpRequest       Request  { get { return ctx.Request; } }
        protected HttpResponse      Response { get { return ctx.Response; } }
        protected HttpServerUtility Server   { get { return ctx.Server; } }


        public void ProcessRequest(HttpContext context)
        {
            if (context == null) throw new ArgumentNullException("context");
            ctx = context;

            //Virtual Resource
            switch (Path.GetFileNameWithoutExtension(context.Request.Url.LocalPath))
            {
                case "CreatePlayer":
                    CreatePlayer();
                    break;
                case "AddPlayer":
                    AddPlayer();
                    break;
                case "StartGame":
                    StartGame();
                    break;
                case "RemovePlayer":
                    RemovePlayer();
                    break;
                case "Play":
                    Play();
                    break;
                case "RefreshCell":
                    RefreshCell();
                    break;
                case "RefreshPlayerBoard":
                    RefreshPlayerBoard();
                    break;
                default:
                    throw new ApplicationException("Invalid Handler Name");
            }
        }

        protected void RefreshPlayerBoard()
        {
            throw new NotImplementedException();
        }

        protected void RefreshCell()
        {
            throw new NotImplementedException();
        }

        protected void Play()
        {
            throw new NotImplementedException();
        }

        protected void RemovePlayer()
        {
            throw new NotImplementedException();
        }

        protected void StartGame()
        {
            throw new NotImplementedException();
        }

        protected void AddPlayer()
        {
            Response.Write(Minesweeper.GameManager.Current[Request["gName"]].AddPlayer(Request["playerName"]));
        }

        protected void CreatePlayer()
        {
            Response.Write( Minesweeper.GameManager.Current.CreateGame(Request["gName"], Request["playerName"]) );
        }
    }
}
