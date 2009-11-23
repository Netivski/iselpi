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
            List<Player> rObj = CurrentGame.GetRefreshPlayer(Generic.GetInt(Request["playerId"]));
            Response.Write(JSon.Serialize<List<Player>>(rObj));
        }

        protected void RefreshCell()
        {
            List<Cell> rObj = CurrentGame.GetRefreshCell(Utils.Generic.GetInt(Request["playerId"]));
            Cell c = new CellMine(1, 1);
            c.Owner = CurrentGame.GetPlayer(Utils.Generic.GetInt(Request["playerId"]));
            Response.Write(Utils.JSon.Serialize<List<Cell>>(rObj));
        }

        private void RefreshGameInfo()
        {
            throw new NotImplementedException();
        }

        protected void ListActiveGames()
        {
            Response.Write(Utils.JSon.Serialize<List<string>>(Minesweeper.GameManager.Current.GetActiveGames()));
        }

        protected void Play()
        {
            //Play receives gameName, playerId, posX, posY
            //CurrentGame.Play(Generic.GetInt(Request["playerId"]));
                //, Generic.GetInt(Request["posX"]), Generic.GetInt(Request["posY"]));
        }

        protected void RemovePlayer()
        {
            //Removes player from game

            //Players must have a structure that keeps id's of removed players

            //When pooling occurs on client-side information about who quit and
            //game over are transmited

            //CurrentGame.RemovePlayer(Generic.GetInt(Request["playerId"]));
        }

        private JSONGame GetJSONGame(String gName)
        {
            JSONGame game;
            game.GameName = gName;
            game.activePlayer = 0;
            game.callingPlayer = 0;
            game.minesLeft = 0;
            game.gStatus = GameStatus.INVALID_NAME;

            return game;
        }

        protected void JoinGame()
        {
            JSONGame game = GetJSONGame(Request["gName"]);
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
            JSONGame game = GetJSONGame(Request["gName"]);

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
            //JSONGame game = GetJSONGame(Request["gName"]);
            //if (CurrentGame.Start())
            //{
            //    game.gStatus = CurrentGame.Status;

            //    //game.activePlayer = CurrentGame.getActivePlayer();
            //    game.activePlayer = 1;

            //    game.callingPlayer = Generic.GetInt(Request["playerId"]);
            //}
            //game.gStatus = GameStatus.STARTED;
            //game.callingPlayer = Generic.GetInt(Request["playerId"]);

            //Response.Write(JSon.Serialize<JSONGame>(game));

            JSONGame game = new JSONGame();
            CurrentGame.Start();
            game.GameName = CurrentGame.Name;
            game.activePlayer = CurrentGame.CurrentPlayer;
            game.minesLeft = CurrentGame.MinesLeft;
            game.gStatus = CurrentGame.Status;

            Response.Write(JSon.Serialize<JSONGame>(game));
        }
    }
}
