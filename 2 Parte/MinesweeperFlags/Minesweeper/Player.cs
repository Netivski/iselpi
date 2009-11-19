using System;
using System.Collections.Generic;

namespace Minesweeper
{
    internal class Player
    {
        string name;
        int    points;
        Dictionary<int, Cell> refreshCell;

        public Player( string name )
        {
            this.name   = name;
            refreshCell = new Dictionary<int, Cell>();
        }

        public string Name
        {
            get
            {
                return name;
            }
            set
            {
                name = value;
            }
        }

        public int Points
        {
            get { return points; }
            set { points = value; }
        }

        public Dictionary<int, Cell> RefreshCell
        {
            get { return refreshCell; }
        }
    }
}
