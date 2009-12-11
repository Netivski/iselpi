﻿using System.Web.Mvc;

namespace MinesweeperControllers
{
    public class GameProfileController : GameBaseController
    {
        [AcceptVerbs(HttpVerbs.Get)]  
        public ActionResult Create()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Create( string eMail, string name, byte[] photo )
        {
            return View();
        }

    }
}