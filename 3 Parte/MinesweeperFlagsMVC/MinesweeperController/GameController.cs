using System;
using System.Web.Mvc;
using Minesweeper;

namespace MinesweeperControllers
{
    public class GameController : GameBaseController
    {
        public ActionResult Show(string gName, string eMail)
        {
            if (gName == null) throw new ArgumentNullException("gName");
            if (eMail == null) throw new ArgumentNullException("eMail");

            if (Minesweeper.Lobby.Current[gName] == null) throw new ArgumentOutOfRangeException("gName");
            if (Minesweeper.Lobby.Current[gName].Status > GameStatus.WAITING_FOR_START) throw new ApplicationException("Invalid Game Status.");

            Minesweeper.GamePlayer gPlayer = Minesweeper.Lobby.Current[gName].GetPlayer(eMail);
            if (gPlayer == null) throw new ApplicationException("Invalid Game Player.");


            ViewData.Add("gName", gName);
            ViewData.Add("pName", gPlayer.Name);
            ViewData.Add("pEMail", gPlayer.EMail);
            ViewData.Add("pId", gPlayer.Id);
            ViewData.Add("isOwner", Minesweeper.Lobby.Current[gName].IsOwner(eMail));

            ViewData.Add("gKey", Utils.GameKey.GetKey());
            return View();
        }

        public ActionResult Lobby(string eMail)
        {
            Minesweeper.Lobby.Current.LoadPlayer(eMail);
            ViewData["eMail"]=eMail;
            return View();
        }
    }
}
