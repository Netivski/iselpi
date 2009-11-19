using System;
using System.Collections.Generic;

namespace Minesweeper
{
    public class Player
    {
        int id;
        string name;
        int    points;
        Dictionary<int, Cell> refreshCell;

        public Player( int id, string name )
        {
            this.id = id;
            this.name   = name;
            refreshCell = new Dictionary<int, Cell>();
        }

        public int Id
        {
            get { return id;  }
            set { id = value; }
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

        public Dictionary<int, Cell> GetRefreshCell()
        {
            return refreshCell;
        }

        public void ResetRefreshCell()
        {
            refreshCell = new Dictionary<int, Cell>();
        }

    }
}
