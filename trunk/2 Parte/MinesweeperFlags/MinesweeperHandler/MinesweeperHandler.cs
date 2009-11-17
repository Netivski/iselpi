using System;
using System.Web;

namespace MinesweeperHandler
{
    public class MinesweeperHandler: IHttpHandler
    {
        public bool IsReusable
        {
            get { return true; }
        }

        public void ProcessRequest(HttpContext ctx)
        {
            if (ctx == null) throw new ArgumentNullException("ctx");

            //ctx.Request.Url
            string hName = ""; // hName == Handler Name
            switch (hName)
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
            throw new NotImplementedException();
        }

        protected void CreatePlayer()
        {
            throw new NotImplementedException();
        }
    }
}
