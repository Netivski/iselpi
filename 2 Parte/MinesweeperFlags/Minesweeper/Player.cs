using System;
using System.Collections.Generic;
using System.Threading;

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
            Monitor.Enter(_refreshPlayer);
            _refreshPlayer.Add(p);
            Monitor.Exit(_refreshPlayer);
        }

        public List<Player> GetRefreshPlayer()
        {
            List<Player> retList;
            Monitor.Enter(_refreshPlayer);
            retList = new List<Player>(_refreshPlayer);
            Monitor.Exit(_refreshPlayer);
            return retList;
        }

        public void ResetRefreshPlayer()
        {
            Monitor.Enter(_refreshPlayer);
            _refreshPlayer.Clear();
            Monitor.Exit(_refreshPlayer);
        }

        public void RefreshAddCell(Cell c)
        {
            Monitor.Enter(_refreshCell);
            _refreshCell.Add(c);
            Monitor.Exit(_refreshCell);
        }

        public List<Cell> GetRefreshCell()
        {
            List<Cell> retList;
            Monitor.Enter(_refreshCell);
            retList = new List<Cell>(_refreshCell);
            Monitor.Exit(_refreshCell);
            return retList;
        }

        public void ResetRefreshCell()
        {
            Monitor.Enter(_refreshCell);
            _refreshCell.Clear();
            Monitor.Exit(_refreshCell);
        }

    }
}
