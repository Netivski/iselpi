using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Minesweeper
{
    public class Player
    {
        string name;
        int    points;

        public Player( string name )
        {
            this.name = name;
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
    }
}
