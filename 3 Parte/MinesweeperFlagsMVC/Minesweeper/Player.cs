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
        List<string> _myFriends;
        List<Player> _refreshFriends;
        List<Player> _refreshPlayers;
        List<Game> _refreshGames;
        List<Message> _refreshMessage;
        List<Message> _refreshInvites;

        public Player() : this(string.Empty) { }

        public Player(string name)
        {
            _name = name;
            _status = PlayerStatus.Online;
            _photos = new Dictionary<string, Photo>();
            _myFriends = new List<string>();
            _refreshFriends = new List<Player>();
            _refreshPlayers = new List<Player>();
            _refreshGames = new List<Game>();
            _refreshMessage = new List<Message>();
            _refreshInvites = new List<Message>();
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

        public bool AddRefreshInvites(string gName, string eMail)
        {
            Message msg = new Message(Invite.GetGameInvite(gName, eMail), eMail);
            if (msg == null) throw new ArgumentNullException("msg");
            lock (_refreshInvites)
            {
                _refreshInvites.Add(msg);
                return true;
            }
        }

        public List<Message> GetRefreshInvites()
        {
            List<Message> retList;
            lock (_refreshInvites)
            {
                retList = new List<Message>(_refreshInvites);
            }
            ResetRefreshInvites();
            return retList;
        }

        public void ResetRefreshInvites()
        {
            lock (_refreshInvites)
            {
                _refreshInvites.Clear();
            }
        }

        //---------------------------------
        // My Friends

        public bool AddFriend(string eMail)
        {
            if (eMail == null) throw new ArgumentNullException("eMail");
            lock (_myFriends)
            {
                if (_myFriends.Contains(eMail)) return false;
                _myFriends.Add(eMail);
                AddRefreshFriends(eMail);
                return true;
            }
        }

        public bool RemoveFriend(string eMail)
        {
            if (eMail == null) throw new ArgumentNullException("eMail");
            lock (_myFriends)
            {
                _myFriends.Remove(eMail);
                return true;
            }
        }


        //---------------------------------
        // Friends

        private bool AddRefreshFriends(string eMail)
        {
            Player friend = Lobby.Current.GetPlayer(eMail);
            if (friend == null)
            {
                friend = new Player(null, eMail, null);
                friend.Status = PlayerStatus.Offline;
            }
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

        private bool AddRefreshFriends(Player friend)
        {
            if (friend == null) throw new ArgumentNullException("friend");
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
            ResetRefreshFriends();
            return retList;
        }

        private void ResetRefreshFriends()
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
            if (eMail == null) throw new ArgumentNullException("eMail");
            Player player = Lobby.Current.GetPlayer(eMail);
            lock (_refreshPlayers)
            {
                _refreshPlayers.Add(player);
                return true;
            }
        }

        public bool AddRefreshPlayers(Player player)
        {
            if (player == null) throw new ArgumentNullException("player");
            lock (_refreshPlayers)
            {
                _refreshPlayers.Add(player);
                return true;
            }
        }

        public List<Player> GetRefreshPlayers()
        {
            List<Player> retList;
            lock (_refreshPlayers)
            {
                retList = new List<Player>(_refreshPlayers);
            }
            ResetRefreshPlayers();
            return retList;
        }

        private void ResetRefreshPlayers()
        {
            lock (_refreshPlayers)
            {
                _refreshPlayers.Clear();
            }
        }


        //---------------------------------
        // Games

        public bool AddRefreshGames(Game game)
        {
            if (game == null) throw new ArgumentNullException("game");

            lock (_refreshGames)
            {
                _refreshGames.Add(game);
                return true;
            }
        }

        public List<Game> GetRefreshGames()
        {
            List<Game> retList;
            lock (_refreshGames)
            {
                retList = new List<Game>(_refreshGames);
            }
            ResetRefreshGames();
            return retList;
        }

        private void ResetRefreshGames()
        {
            lock (_refreshGames)
            {
                _refreshGames.Clear();
            }
        }


        //---------------------------------
        // Messages

        public bool AddMessage(Message msg)
        {
            if (msg == null) throw new ArgumentNullException("msg");
            lock (_refreshMessage)
            {
                _refreshMessage.Add(msg);
                return true;
            }
        }

        public List<Message> GetRefreshMessages()
        {
            List<Message> retList;
            lock (_refreshMessage)
            {
                retList = new List<Message>(_refreshMessage);
            }
            ResetRefreshMessages();
            return retList;
        }

        public void ResetRefreshMessages()
        {
            lock (_refreshMessage)
            {
                _refreshMessage.Clear();
            }
        }


        //---------------------------------

        public virtual string ToJSon()
        {
            string imgUrl = GetDefaultPhoto() == null ? "" : GetDefaultPhoto().Name;
            return "{\"name\":\"" + _name + "\", \"email\":\"" + _eMail
                + "\", \"status\":\"" + _status + "\", \"photo\":\""
                + imgUrl + "\"}";
        }
    }
}
