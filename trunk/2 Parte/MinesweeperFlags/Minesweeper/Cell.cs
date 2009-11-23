using System;

namespace Minesweeper
{
    public abstract class Cell
    {
        CellType type;
        bool hidden;
        Player owner  = null;
        int _posX;
        int _posY;        

        public Cell(CellType type, int posX, int posY)
        {
            this.type = type;
            hidden    = true;
            _posX = posX;
            _posY = posY;
        }

        public int PosX { get { return _posX; } }

        public int PosY { get { return _posY; } }

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
