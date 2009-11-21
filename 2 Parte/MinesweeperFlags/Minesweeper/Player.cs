using System;
using System.Collections.Generic;

namespace Minesweeper
{
    public class Player
    {
        int id;
        string name;
        int points;
        List<Cell> refreshCell;
        List<Player> refreshPlayer;

        public Player(int id, string name)
        {
            this.id = id;
            this.name = name;
            refreshCell = new List<Cell>();
            refreshPlayer = new List<Player>();
        }

        public int Id
        {
            get { return id; }
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

        public void RefreshAddPlayer(Player p)
        {
            refreshPlayer.Add(p);
        }

        public List<Player> GetRefreshPlayer()
        {
            return new List<Player>(refreshPlayer);
        }

        public void ResetRefreshPlayer()
        {
            refreshPlayer.Clear();
        }

        public List<Cell> GetRefreshCell()
        {
            return refreshCell;
        }

        public void ResetRefreshCell()
        {
            refreshCell = new List<Cell>();
        }

    }
}
