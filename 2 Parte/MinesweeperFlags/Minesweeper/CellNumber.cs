using System;

namespace Minesweeper
{
    internal class CellNumber: Cell
    {
        int value;

        public CellNumber(int posX, int posY): base(CellType.Number , posX , posY) 
        {
            value = 0;
        }

        public int Value
        {
            get { return value; }
        }

        public void IncValue()
        {
            value += 1;
        }
    }
}
