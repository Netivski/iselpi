using System.Collections.Generic;
using System.Web.Mvc;
using MinesweeperControllers.Proxy;
using MinesweeperControllers.Utils;
using Minesweeper;

namespace MinesweeperControllers
{
    public class GameAsynchronousController : GameBaseController
    {
        public GameAsynchronousController() { }


        public ActionResult RevealBoard(int playerId)
        {
            CurrentGame.RevealBoard(playerId - 1);
            return RefreshCell(playerId);
        }

        public ActionResult RefreshPlayerBoard(int playerId)
        {
            List<Player> rObj = CurrentGame.GetRefreshPlayer(playerId - 1);
            return new ContentResult() { Content = Generic.GetJSon(rObj), ContentType = "ContentType" };
        }
        
        public ActionResult RefreshCell(int playerId)
        {
            List<Cell> rObj = CurrentGame.GetRefreshCell(playerId - 1);

            return new ContentResult() { Content = Generic.GetJSon(rObj), ContentType = "ContentType" };
        }

        public ActionResult RefreshGameInfo(string gName)
        {
            JSONGame game = new JSONGame(gName);
            game.minesLeft = CurrentGame.MinesLeft;
            game.activePlayer = CurrentGame.CurrentPlayer;
            game.gStatus = CurrentGame.Status;

            return new ContentResult() { Content = game.ToJSon(), ContentType = "ContentType" };
        }

        public ActionResult ListActiveGames()
        {
            return new ContentResult() { Content = Utils.JSon.Serialize<List<string>>(Minesweeper.GameManager.Current.GetActiveGames()), ContentType = "ContentType" };
        }

        public ActionResult Play(int playerId, int posX, int posY)
        {
            playerId -= - 1;
            if (playerId == CurrentGame.CurrentPlayer && CurrentGame.Status != GameStatus.GAME_OVER)
            {
                CurrentGame.Play(playerId, posX, posY);
            }
            return new EmptyResult();
        }

        public ActionResult RemovePlayer(int playerID)
        {
            CurrentGame.RemovePlayer(playerID - 1);

            return new EmptyResult();
        }

        public ActionResult JoinGame(string gName, string playerName)
        {
            JSONGame game = new JSONGame(gName);
            if (CurrentGame != null)
            {
                game.callingPlayer = CurrentGame.AddPlayer(playerName);
                game.gStatus = (game.callingPlayer == ~0 ? GameStatus.CROWDED : CurrentGame.Status);
                game.minesLeft = CurrentGame.MinesLeft;
            }

            return new ContentResult() { Content = game.ToJSon(), ContentType = "ContentType" };
        }

        public ActionResult CreateGame(string gName, string playerName)
        {
            JSONGame game = new JSONGame(gName);

            if (Minesweeper.GameManager.Current.CreateGame(game.GameName, playerName)) 
            {
                game.gStatus = GameStatus.WAITING_FOR_PLAYERS;
                game.minesLeft = CurrentGame.MinesLeft;
                game.callingPlayer = 1;
            }

            return new ContentResult() { Content = game.ToJSon(), ContentType = "ContentType" };
        }

        public ActionResult StartGame(string gName, int playerId)
        {
            JSONGame game = new JSONGame(gName);

            CurrentGame.Start();
            game.activePlayer = CurrentGame.CurrentPlayer;
            game.callingPlayer = playerId;
            game.minesLeft = CurrentGame.MinesLeft;
            game.gStatus = CurrentGame.Status;

            return new ContentResult() { Content = game.ToJSon(), ContentType = "ContentType" };
        }
    }
}
