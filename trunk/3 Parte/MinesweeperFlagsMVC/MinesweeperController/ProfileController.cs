﻿using System;
using System.Web;
using System.Web.Mvc;
using System.IO;
using Minesweeper;


namespace MinesweeperControllers
{
    public class ProfileController : GameBaseController
    {
        [AcceptVerbs(HttpVerbs.Get)]  
        public ActionResult Create( string eMail )
        {
            ViewData.Model = GameManager.Current.LoadPlayer( eMail );
            return new ViewResult() { ViewData = ViewData };            
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Create(string eMail, string name, HttpPostedFileBase photo, string online)
        {
            Player nPlayer; // nPlayer == New Player
            if ((nPlayer = GameManager.Current.LoadPlayer(eMail)) == null)
            {
                nPlayer = new Player(name, eMail);
            }

            nPlayer.Name   = name;
            nPlayer.Status = (string.Compare(online, "on", true) == 0 ? PlayerStatus.Online : PlayerStatus.Offline);
            if (photo != null) nPlayer.AddPhoto(new Photo() { Name = photo.FileName, ContentType = photo.ContentType, Image = photo.InputStream });

            GameManager.Current.AddPlayer(nPlayer);
            ViewData.Model = nPlayer;
            return new ViewResult() { ViewData = ViewData };            
        }

        public ActionResult GetPlayerPhoto(string eMail)
        {
            Player player;
            if ((player = GameManager.Current.LoadPlayer(eMail)) != null)
            {
                Photo dPhoto; //dPhoto = Default Photo
                if ((dPhoto = player.GetDefaultPhoto()) != null)
                {
                    dPhoto.Image.Seek(0, SeekOrigin.Begin);
                    Response.ClearContent();
                    Response.ClearHeaders();
                    Response.BufferOutput = true;
                    Response.ContentType  = dPhoto.ContentType;
                    byte[] buffer = new byte[512];

                    while( (dPhoto.Image.Read(buffer, 0, buffer.Length)) > 0 )
                    {
                        Response.BinaryWrite(buffer);
                    }
                }                                      
            }

            return new EmptyResult();
        }

        public ActionResult Show( string eMail )
        {
            ViewData.Model = GameManager.Current.LoadPlayer(eMail); 
            return new ViewResult() { ViewData = ViewData };
        }

    }
}
