using System;
using System.Web.Mvc;
using Minesweeper;

namespace MinesweeperControllers
{
    public class GameController : GameBaseController
    {
        public ActionResult Create(string gName, string playerName, string playerEMail)
        {
            if (Minesweeper.Lobby.Current.CreateGame(gName, playerName, playerEMail))
            {
                return Show(gName, playerEMail);
            }


            return new EmptyResult();
        }

        public ActionResult Join(string gName, string playerName, string playerEMail)
        {
            if (CurrentGame != null)
            {
                CurrentGame.AddPlayer(playerName, playerEMail);
                return Show(gName, playerEMail);
            }


            return new EmptyResult();
        }


        ActionResult Show(string gName, string eMail)
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
            return View("Show");
        }
        public ActionResult Lobby(string eMail)
        {
            Minesweeper.Lobby.Current.LoadPlayer(eMail);
            ViewData["eMail"] = eMail;
            return View();
        }

        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult Start()
        {
            ViewData["message"] = "";
            return View();
        }

        public ActionResult Main(string eMail)
        {
            Minesweeper.Lobby.Current.LoadPlayer(eMail);
            ViewData["eMail"] = eMail;
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Start(string email)
        {
            if (email != null && email.Contains("@") && email.Contains("."))
            {
                Player p = null;
                if ((p = Minesweeper.Lobby.Current.GetPlayer(email)) != null)
                {
                    Minesweeper.Lobby.Current.LoadPlayer(email);
                    return View("Main", p);
                }
                else
                {
                    ViewData["message"] = "E-mail " + email + " is not registered!";
                    return View();
                }
            }
            ViewData["message"] = "Please insert a valid e-mail!";
            return View();
        }
    }
}
