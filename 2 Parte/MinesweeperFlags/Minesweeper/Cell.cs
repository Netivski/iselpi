using System;

namespace Minesweeper
{
    public abstract class Cell
    {
        CellType type;
        bool     hidden;
        Player   owner  = null; 

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

        public Player Owner
        {
            get { return owner; }
            set { owner = value; }
        }

    }
}
