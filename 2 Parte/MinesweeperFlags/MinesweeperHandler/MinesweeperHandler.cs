using System;
using System.Collections.Generic;
using System.Web;
using System.IO;
using MinesweeperHandler.Proxy;
using MinesweeperHandler.Utils;
using Minesweeper;

namespace MinesweeperHandler
{
    public class MinesweeperHandler : IHttpHandler
    {
        HttpContext ctx = null;

        public bool IsReusable
        {
            get { return true; }
        }

        protected HttpRequest Request { get { return ctx.Request; } }
        protected HttpResponse Response { get { return ctx.Response; } }
        protected HttpServerUtility Server { get { return ctx.Server; } }

        protected Game CurrentGame
        {
            get { return Minesweeper.GameManager.Current[Request["gName"]]; }
        }

        public void ProcessRequest(HttpContext context)
        {
            if (context == null)
                throw new ArgumentNullException("context");
            ctx = context;

            //Virtual Resource
            switch (Path.GetFileNameWithoutExtension(context.Request.Url.LocalPath))
            {
                case "ListActiveGames":
                    ListActiveGames();
                    break;
                case "RemovePlayer":
                    RemovePlayer();
                    break;
                case "CreateGame":
                    CreateGame();
                    break;
                case "JoinGame":
                    JoinGame();
                    break;
                case "StartGame":
                    StartGame();
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
                case "RefreshGameInfo":
                    RefreshGameInfo();
                    break;
                default:
                    throw new ApplicationException("Invalid Handler Name");
            }
        }

        protected void RefreshPlayerBoard()
        {
            List<Player> rObj = CurrentGame.GetRefreshPlayer(Generic.GetInt(Request["playerId"]) - 1);
            Response.Write(JSon.Serialize<List<Player>>(rObj));
        }
        protected void RefreshCell()
        {
            List<Cell> rObj = CurrentGame.GetRefreshCell(Utils.Generic.GetInt(Request["playerId"]) - 1);
            Response.Write(Generic.GetJSon(rObj));
        }
        protected void RefreshGameInfo()
        {
            JSONGame game = new JSONGame(Request["gName"]);
            game.minesLeft = CurrentGame.MinesLeft;
            game.activePlayer = CurrentGame.CurrentPlayer;
            game.gStatus = CurrentGame.Status;
            Response.Write(JSon.Serialize<JSONGame>(game));
        }
        protected void ListActiveGames()
        {
            Response.Write(Utils.JSon.Serialize<List<string>>(Minesweeper.GameManager.Current.GetActiveGames()));
        }
        protected void Play()
        {
            //Play receives gameName, playerId, posX, posY
            int playerId = Generic.GetInt(Request["playerId"]) - 1;
            if(playerId == CurrentGame.CurrentPlayer)
            {
                CurrentGame.Play(playerId, Generic.GetInt(Request["posX"]), Generic.GetInt(Request["posY"]));
            }            
            Response.Write("");
        }
        protected void RemovePlayer()
        {
            CurrentGame.RemovePlayer(Generic.GetInt(Request["playerID"]) - 1);            
        }
        protected void JoinGame()
        {
            JSONGame game = new JSONGame(Request["gName"]);
            if (CurrentGame != null)
            {
                game.callingPlayer = CurrentGame.AddPlayer(Request["playerName"]);
                game.gStatus = (game.callingPlayer == ~0 ?
                    GameStatus.CROWDED : CurrentGame.Status);
                game.minesLeft = CurrentGame.MinesLeft;
            }
            Response.Write(Utils.JSon.Serialize<JSONGame>(game));
        }
        protected void CreateGame()
        {
            JSONGame game = new JSONGame(Request["gName"]);

            if (Minesweeper.GameManager.Current.CreateGame(game.GameName, Request["playerName"]))
            {
                game.gStatus = GameStatus.WAITING_FOR_PLAYERS;
                game.minesLeft = CurrentGame.MinesLeft;
                game.callingPlayer = 1;
            }
            Response.Write(Utils.JSon.Serialize<JSONGame>(game));
        }
        protected void StartGame()
        {
            JSONGame game = new JSONGame(Request["gName"]);

            CurrentGame.Start();
            game.activePlayer = CurrentGame.CurrentPlayer;
            game.callingPlayer = Generic.GetInt(Request["playerId"]);
            game.minesLeft = CurrentGame.MinesLeft;
            game.gStatus = CurrentGame.Status;

            Response.Write(JSon.Serialize<JSONGame>(game));
        }
    }
}
