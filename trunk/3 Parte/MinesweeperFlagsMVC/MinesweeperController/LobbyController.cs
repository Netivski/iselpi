using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Minesweeper;
using MinesweeperControllers.Utils;
using System.Web.Mvc;

namespace MinesweeperControllers
{
    public class LobbyController : GameBaseController
    {

        public LobbyController() { }

        //------------------------------
        // Pooling Handlers

        public ActionResult RefreshPlayers(string eMail)
        {
            Player p = Lobby.Current.GetPlayer(eMail);
            if (p != null)
            {
                List<Player> rObj = p.GetRefreshPlayers();
                return new ContentResult() { Content = Generic.GetJSon(rObj), ContentType = "text/x-json" };
            }
            return null;
        }

        public ActionResult RefreshFriends(string eMail)
        {
            Player f = Lobby.Current.GetPlayer(eMail);
            if (f != null)
            {
                List<Player> rObj = f.GetRefreshFriends();
                return new ContentResult() { Content = Generic.GetJSon(rObj), ContentType = "text/x-json" };
            }
            return null;
        }

        public ActionResult RefreshMessages(string eMail)
        {
            Player p = Lobby.Current.GetPlayer(eMail);
            if (p != null)
            {
                List<Message> rObj = p.GetRefreshMessages();
                return new ContentResult() { Content = Generic.GetJSon(rObj), ContentType = "text/x-json" };
            }
            return null;
        }

        public ActionResult RefreshProfile(string eMail)
        {
            Player rObj = Lobby.Current.GetPlayer(eMail);
            if (rObj != null)
            {
                return new ContentResult() { Content = Generic.GetJSon(rObj), ContentType = "text/x-json" };
            }
            return null;
        }


        //------------------------------
        // Event Handlers

        public ActionResult StartPublicGame(string gName, string eMail)
        {
            return View("GameBoard");
        }

        public ActionResult StartPrivateGame(string gName, string eMail)
        {
            return View("GameBoard");
        }

    }
}
