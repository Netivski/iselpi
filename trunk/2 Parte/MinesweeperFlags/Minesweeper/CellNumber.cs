using System;

namespace Minesweeper
{
    internal class CellNumber: Cell
    {
        int value;

        public CellNumber(): base( CellType.Number) 
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
