using System;
using System.Web;
using System.IO;
using MinesweeperHandler.Proxy;

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
                case "ListActiveGames":
                    ListActiveGames();
                    break;
                case "CreateGameForm":
                    CreateGameForm();
                    break;
                case "JoinPlayerForm":
                    JoinPlayerForm();
                    break;
                case "CreateGame":
                    CreateGame();
                    break;
                case "JoinPlayer":
                    JoinPlayer();
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

        protected void JoinPlayerForm()
        {
            throw new NotImplementedException();
        }

        protected void CreateGameForm()
        {
            throw new NotImplementedException();
        }

        protected void ListActiveGames()
        {
            throw new NotImplementedException();
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
            Response.Write(Minesweeper.GameManager.Current[Request["gName"]].Start());
        }

        protected void JoinPlayer()
        {
            JSONPlayer player;
            player.GameName   = Request["gName"];
            player.PlayerName = Request["playerName"];
            player.PlayerId   = Minesweeper.GameManager.Current[player.GameName].JoinPlayer(player.PlayerName);


            Response.Write(Utils.JSon.Serialize<JSONPlayer>(player));
        }

        protected void CreateGame()
        {
            JSONPlayer player;
            player.GameName   = Request["gName"];
            player.PlayerName = Request["playerName"];
            player.PlayerId   = Minesweeper.GameManager.Current.CreateGame(player.GameName, player.PlayerName)? 1: ~0;

            Response.Write(Utils.JSon.Serialize<JSONPlayer>(player));
        }
    }
}
