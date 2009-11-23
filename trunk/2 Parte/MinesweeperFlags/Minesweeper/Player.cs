using System;
using System.Collections.Generic;

namespace Minesweeper
{
    public class Player
    {
        int _id;
        string _name;
        int _points;
        bool _active;
        List<Cell> _refreshCell;
        List<Player> _refreshPlayer;

        public Player(int id, string name)
        {
            _id = id;
            _name = name;
            _active = false;
            _points = 0;
            _refreshCell = new List<Cell>();
            _refreshPlayer = new List<Player>();
        }

        public int Id
        {
            get { return _id; }
            set { _id = value; }
        }

        public string Name
        {
            get
            {
                return _name;
            }
            set
            {
                _name = value;
            }
        }

        public int Points
        {
            get { return _points; }
            set { _points = value; }
        }

        public bool Active
        {
            get { return _active; }
            set { _active = value; }
        }

        public void RefreshAddPlayer(Player p)
        {
            _refreshPlayer.Add(p);
        }
        public void RefreshAddCell(Cell c)
        {
            _refreshCell.Add(c);
        }

        public List<Player> GetRefreshPlayer()
        {
            return new List<Player>(_refreshPlayer);            
        }

        public void ResetRefreshPlayer()
        {
            _refreshPlayer.Clear();            
        }

        public List<Cell> GetRefreshCell()
        {
            return _refreshCell;
        }

        public void ResetRefreshCell()
        {
            _refreshCell = new List<Cell>();
        }

    }
}
