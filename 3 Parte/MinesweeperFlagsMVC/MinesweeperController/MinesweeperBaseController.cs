﻿using System;
using System.Collections.Generic;
using System.Web;
using System.IO;
using System.Web.Mvc;
using MinesweeperControllers.Proxy;
using MinesweeperControllers.Utils;
using Minesweeper;

namespace MinesweeperControllers
{
    public class MinesweeperBaseController: Controller
    {
        public MinesweeperBaseController() { }

        protected Game CurrentGame
        {
            get { return Minesweeper.GameManager.Current[Request["gName"]]; }
        }

    }
}