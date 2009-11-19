using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Minesweeper
{
    [Flags]
    public enum GameStatus
    {
         WAITING_FOR_PLAYERS = 0X0
        ,WAITING_FOR_START   = 0X1
        ,STARTED             = 0X2
    }
}
