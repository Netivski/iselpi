using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Minesweeper
{
    [Flags]
    public enum GameStatus
    {
         WAITING = 0X0
        ,STARTED = 0X1
    }
}
