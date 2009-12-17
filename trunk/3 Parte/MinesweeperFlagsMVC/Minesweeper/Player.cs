using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using System.Threading;

namespace Minesweeper
{
    public class Player : IToJSon
    {
        string _name;
        string _eMail;
        PlayerStatus _status;
        Dictionary<string, Photo> _photos;
        Dictionary<string, Player> _myFriends;
        List<Player> _refreshFriends;
        List<Player> _refreshPlayers;
        List<Message> _refreshMessage;

        public Player() : this(string.Empty) { }

        public Player(string name)
        {
            _name = name;
            _status = PlayerStatus.Online;
            _photos = new Dictionary<string, Photo>();
            _myFriends = new Dictionary<string, Player>();
            _refreshFriends = new List<Player>();
            _refreshPlayers = new List<Player>();
            _refreshMessage = new List<Message>();
        }

        public Player(string name, string eMail)
            : this(name)
        {
            _eMail = eMail;
        }

        public Player(string name, string eMail, Photo photo)
            : this(name, eMail)
        {
            if (photo != null) AddPhoto(photo);
        }

        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }

        public string EMail
        {
            get { return _eMail; }
            set { _eMail = value; }
        }

        public PlayerStatus Status
        {
            get { return _status; }
            set { _status = value; }
        }

        public bool Online { get { return _status == PlayerStatus.Online; } }
        public bool Offline { get { return !Online; } }


        //---------------------------------
        // Photos

        public void AddPhoto(Photo photo)
        {
            if (photo == null) throw new ArgumentNullException("photo");
            if (photo.Name == null) throw new ArgumentNullException("photo.Name");

            _photos = new Dictionary<string, Photo>();
            _photos.Add(photo.Name, photo);

        }

        public void AddPhoto(string name, string contentType, Stream image)
        {
            AddPhoto(new Photo() { Name = name, ContentType = contentType, Image = image });
        }

        public Photo GetDefaultPhoto()
        {
            if (_photos.Count > 0)
            {
                Dictionary<string, Photo>.KeyCollection.Enumerator photosEnum = _photos.Keys.GetEnumerator();
                if (photosEnum.MoveNext())
                {
                    return _photos[photosEnum.Current];
                }
            }

            return null;
        }


        //---------------------------------
        // Invites

        public bool ReceiveGameInvite(string gName, string pName)
        {
            Message msg = new Message(Invite.GetGameInvite(gName, pName));
            if (!_refreshMessage.Contains(msg))
            {
                this.AddMessage(msg);
                return true;
            }
            return false;
        }


        //---------------------------------
        // My Friends

        public bool AddFriend(string eMail)
        {
            if (eMail == null) throw new ArgumentNullException("Null eMail!");
            lock (_myFriends)
            {
                if (_myFriends.ContainsKey(eMail)) return false;
                _myFriends.Add(eMail, Lobby.Current.getPlayer(eMail));
                AddRefreshFriends(eMail);
                return true;
            }
        }

        public bool RemoveFriend(string eMail)
        {
            if (eMail == null) throw new ArgumentNullException("Null eMail!");
            lock (_myFriends)
            {
                _myFriends.Remove(eMail);
                return true;
            }
        }

        //---------------------------------
        // Friends Refresh

        private bool AddRefreshFriends(string eMail)
        {
            Player friend = Lobby.Current.getPlayer(eMail);
            if (friend == null) throw new ArgumentNullException("Friend not in game!");
            lock (_refreshFriends)
            {
                if (!_refreshFriends.Contains(friend))
                {
                    _refreshFriends.Add(friend);
                    return true;
                }
            }
            return false;
        }

        public List<Player> GetRefreshFriends()
        {
            List<Player> retList;
            lock (_refreshFriends)
            {
                retList = new List<Player>(_refreshFriends);
            }
            return retList;
        }

        public void ResetRefreshFriends()
        {
            lock (_refreshFriends)
            {
                _refreshFriends.Clear();
            }
        }


        //---------------------------------
        // Players

        public bool AddRefreshPlayers(string eMail)
        {
            Player player = Lobby.Current.getPlayer(eMail);
            if (player == null) return false;
            lock (_refreshPlayers)
            {
                if (!_refreshPlayers.Contains(player))
                {
                    _refreshPlayers.Add(player);
                    return true;
                }
            }
            return false;
        }

        public List<Player> GetRefreshPlayers()
        {
            List<Player> retList;
            lock (_refreshPlayers)
            {
                retList = new List<Player>(_refreshPlayers);
            }
            return retList;
        }

        public void ResetRefreshPlayers()
        {
            lock (_refreshFriends)
            {
                _refreshPlayers.Clear();
            }
        }


        //---------------------------------
        // Messages

        public void AddMessage(Message msg)
        {
            lock (_refreshMessage)
            {
                _refreshMessage.Add(msg);
            }
        }

        public List<Message> GetRefreshMessages()
        {
            List<Message> retList;
            lock (_refreshMessage)
            {
                retList = new List<Message>(_refreshMessage);
            }
            return retList;
        }

        //---------------------------------

        public virtual string ToJSon()
        {
            return "{\"name\":\"" + _name + ", \"email\":\"" + _eMail
                + "\", \"status\":\"" + _status + "\"}";
        }
    }
}
