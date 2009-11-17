using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Minesweeper
{
    public abstract class Cell
    {
        CellType type;
        bool     hidden;

        public Cell(CellType type)
        {
            this.type = type;
            hidden    = true;
        }

        public CellType Type
        {
            get { return type; }
        }

        public bool Hidden
        {
            get { return hidden; }
            set { hidden = value; }
        }

    }
}
