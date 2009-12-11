using System;
using System.Collections.Generic;
using System.Threading;

namespace Minesweeper
{
    public class Player : IToJSon
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
            _active = true;
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
            get { return _name; }
            set { _name = value; }
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
            lock (_refreshPlayer)
            {
                _refreshPlayer.Add(p);
            }
        }

        public List<Player> GetRefreshPlayer()
        {
            List<Player> retList;
            lock (_refreshPlayer)
            {
                retList = new List<Player>(_refreshPlayer);
            }
            return retList;
        }

        public void ResetRefreshPlayer()
        {
            lock (_refreshPlayer)
            {
                _refreshPlayer.Clear();
            }
        }

        public void RefreshAddCell(Cell c)
        {
            lock (_refreshCell)
            {
                _refreshCell.Add(c);
            }
        }

        public List<Cell> GetRefreshCell()
        {
            List<Cell> retList;
            lock (_refreshCell)
            {
                retList = new List<Cell>(_refreshCell);
            }
            return retList;
        }

        public void ResetRefreshCell()
        {
            lock (_refreshCell)
            {
                _refreshCell.Clear();
            }
        }

        public string ToJSon()
        {
            return "{\"id\":\"" + _id + "\", \"name\":\"" + _name + "\", \"points\":" + _points
                + ", \"active\":" + (_active?1:0) + "}";
        }
    }
}
