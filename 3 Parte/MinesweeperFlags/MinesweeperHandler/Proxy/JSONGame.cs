using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Minesweeper;

namespace MinesweeperControllers.Proxy
{
    internal struct JSONGame : IToJSon
    {
        public string GameName;
        public int activePlayer;
        public int callingPlayer;
        public int minesLeft;
        public GameStatus gStatus;

        public JSONGame(String gName)
        {
            GameName = gName;
            activePlayer = 0;
            callingPlayer = 0;
            minesLeft = 0;
            gStatus = GameStatus.INVALID_NAME;
        }

        public string ToJSon()
        {
            return "{\"GameName\":\"" + GameName + "\", \"activePlayer\":\"" + activePlayer
                + "\", \"callingPlayer\":\"" + callingPlayer + "\", \"minesLeft\":\"" + minesLeft
                + "\", \"gStatus\":\"" + (int)gStatus + "\"}";

        }
    }
}
