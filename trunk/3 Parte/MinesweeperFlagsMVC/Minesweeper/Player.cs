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
        Dictionary<string, Photo> _photos;

        public Player() : this(string.Empty) { }

        
        public Player(string name)
        {            
            _name    = name;
            _photos  = new Dictionary<string, Photo>();
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


        public virtual string ToJSon()
        {
            return "{\"name\":\"" + _name + ", \"email\":\"" + _eMail + "\"}";
        }
    }
}
