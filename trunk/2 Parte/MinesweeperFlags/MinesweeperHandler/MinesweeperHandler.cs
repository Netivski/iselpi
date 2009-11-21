using System;
using System.Collections.Generic;
using System.Web;
using System.IO;
using MinesweeperHandler.Proxy;
using Minesweeper;

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


        protected Game CurrentGame
        {
            get { return Minesweeper.GameManager.Current[Request["gName"]]; }
        }


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
                case "RefreshGameOver":
                    RefreshGameOver();
                    break;
                default:
                    throw new ApplicationException("Invalid Handler Name");
            }
        }

        private void RefreshGameOver()
        {
            throw new NotImplementedException();
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
            Response.Write(Utils.JSon.Serialize<List<string>>(Minesweeper.GameManager.Current.GetActiveGames()));
        }

        protected void RefreshPlayerBoard()
        {
            throw new NotImplementedException();
        }

        protected void RefreshCell()
        {
            Dictionary<int, Cell>  rObj = CurrentGame.GetRefreshCell(Utils.Generic.GetInt(Request["playerId"]));
            Cell c = new CellMine(1,1);
            c.Owner = CurrentGame.GetPlayer( Utils.Generic.GetInt(Request["playerId"]) );
            rObj.Add(1, c); 
            Response.Write(Utils.JSon.Serialize<Dictionary<int, Cell>>(rObj));
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
            //if (CurrentGame.Start())
                //Response.Write("[{'A':2}]");
        }

        protected void AddPlayer()
        {
            JSONPlayer player;
            player.GameName   = Request["gName"];
            player.PlayerName = Request["playerName"];
            player.PlayerId   = CurrentGame.AddPlayer(player.PlayerName);
            player.active = 1;
            player.score = 0;
            Response.Write(Utils.JSon.Serialize<JSONPlayer>(player));
        }

        protected void CreateGame()
        {
            JSONGame game;
            game.GameName = Request["gName"];
            game.activePlayer = 0;
            game.callingPlayer = 0;
            game.minesLeft = 0;
            game.gStatus = GameStatus.INVALID;
            
            if (GameManager.Current.CreateGame(game.GameName, Request["playerName"]))
            {
                game.gStatus = GameStatus.WAITING_FOR_PLAYERS;
                game.minesLeft = GameManager.Current[game.GameName].MinesLeft;
                game.callingPlayer = 1;
            }

            Response.Write(Utils.JSon.Serialize<JSONGame>(game));

            //JSONPlayer player;
            //player.GameName   = Request["gName"];
            //player.PlayerName = Request["playerName"];
            //player.PlayerId   = Minesweeper.GameManager.Current.CreateGame(player.GameName, player.PlayerName)? 1: ~0;
            //Response.Write(Utils.JSon.Serialize<JSONPlayer>(player));
        }
    }
}
