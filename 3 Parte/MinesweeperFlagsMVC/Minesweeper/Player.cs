using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using System.Threading;

namespace Minesweeper
{
    public class Player : IToJSon
    {        
        string       _name;
        string       _eMail;
        PlayerStatus _status;
        Dictionary<string, Photo>  _photos;
        Dictionary<string, Invite> _invite;
        Dictionary<string, Player> _friends;
        LinkedList<Message>        _message;
        object                     _mMonitor;  // _mMonitor == Message Monitor


        public Player() : this(string.Empty) { }

        
        public Player(string name)
        {            
            _name     = name;
            _status   = PlayerStatus.Online; 
            _photos   = new Dictionary<string, Photo>();
            _invite   = new Dictionary<string, Invite>();
            _friends  = new Dictionary<string, Player>();
            _message  = new LinkedList<Message>();
            _mMonitor = new object();

        }

        public Player(string name, string eMail): this( name )
        {
            _eMail = eMail;
        }

        public Player(string name, string eMail, Photo photo): this( name, eMail ) 
        {    
            if( photo != null ) AddPhoto(photo);
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

        public bool Online  { get { return _status == PlayerStatus.Online; } }
        public bool Offline { get { return !Online; } }

        public void AddPhoto(Photo photo)
        {
            if( photo      == null ) throw new ArgumentNullException( "photo" );
            if( photo.Name == null ) throw new ArgumentNullException( "photo.Name" );

            _photos = new Dictionary<string, Photo>();
            _photos.Add(photo.Name, photo);
            
        }

        public void AddPhoto(string name, string contentType, Stream image)
        {
            AddPhoto( new Photo() { Name = name, ContentType = contentType, Image = image } );
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

        public bool AddInvite(string gName, string eMail)
        {
            if (_invite.ContainsKey(gName)) return false;

            _invite.Add(gName, new Invite() { GameName = gName, Player = GameManager.Current.LoadPlayer( eMail ) });

            return true;
        }

        public bool AcceptInvite( string gName )
        {            
            if (!_invite.ContainsKey(gName)) throw new ApplicationException( "Invalid Invite!" );

            return _invite.Remove(gName);
        }

        public bool AddFriend(string eMail)
        {
            if (_friends.ContainsKey(eMail)) return false;

            _friends[eMail] = GameManager.Current.LoadPlayer(eMail);
            return true;
        }

        public bool RemoveFriend(string eMail)
        {
            if (!_friends.ContainsKey(eMail)) return false;

            return _friends.Remove(eMail); 
        }

        public void AddMessage(Message msg)
        {
            lock (_mMonitor)
            {
                _message.AddLast(msg);
            }
        }

        public LinkedList<Message> GetMessage()
        {
            LinkedList<Message> rObj;
            lock (_mMonitor)
            {
                rObj     = _message;
                _message = new LinkedList<Message>();
            }
            return rObj;
        }

        public virtual string ToJSon()
        {
            return "{\"name\":\"" + _name + ", \"email\":\"" + _eMail + "\"}";
        }
    }
}
