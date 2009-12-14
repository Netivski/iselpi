using System;
using System.Collections.Generic;

namespace Minesweeper
{
    public class GamePlayer: Player
    {
        int  _id;
        int  _points;
        bool _active;
        readonly List<Cell>       _refreshCell;
        readonly List<GamePlayer> _refreshPlayer;

        public GamePlayer(int id) : this(id, null, null, null) { }

        public GamePlayer(int id, string name) : this(id, name, null, null) { }

        public GamePlayer(int id, string name, string eMail): this( id, name, eMail, null ){}

        public GamePlayer(int id, string name, string eMail, Photo photo): base(name, eMail, photo) 
        { 
            _id = id;
            _active = true;
            _points = 0;

            _refreshCell   = new List<Cell>();
            _refreshPlayer = new List<GamePlayer>();
        } 

        public int Id
        {
            get { return _id; }
            set { _id = value; }
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


        public void RefreshAddPlayer(GamePlayer p)
        {
            lock (_refreshPlayer)
            {
                _refreshPlayer.Add(p);
            }
        }

        public List<GamePlayer> GetRefreshPlayer()
        {
            List<GamePlayer> retList;
            lock (_refreshPlayer)
            {
                retList = new List<GamePlayer>(_refreshPlayer);
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

        public override string ToJSon()
        {
            return "{\"id\":\"" + _id + "\", \"name\":\"" + Name + "\", \"points\":" + _points + ", \"active\":" + (_active ? 1 : 0) + ", \"email\":\"" + EMail + "\"}";
        }
    }
}
