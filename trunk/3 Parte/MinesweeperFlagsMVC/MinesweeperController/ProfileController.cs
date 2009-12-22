using System;
using System.Web;
using System.Web.Mvc;
using System.IO;
using Minesweeper;


namespace MinesweeperControllers
{
    public class ProfileController : GameBaseController
    {
        [AcceptVerbs(HttpVerbs.Get)]
        //public ActionResult Create(string eMail)
        //{
        //    if (eMail != null)
        //        ViewData.Model = Lobby.Current.LoadPlayer(eMail);
        //    return new ViewResult() { ViewData = ViewData };
        //}
        public ActionResult Create()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Create(string eMail, string name, bool online)
        {
            HttpPostedFileBase photo = Request.Files[0];
            Player nPlayer; // nPlayer == New Player
            if ((nPlayer = Lobby.Current.LoadPlayer(eMail)) == null)
            {
                nPlayer = new Player(name, eMail);
            }

            nPlayer.Name = name;
            nPlayer.Status = (online ? PlayerStatus.Online : PlayerStatus.Offline);
            if (photo != null) nPlayer.AddPhoto(new Photo() { Name = photo.FileName, ContentType = photo.ContentType, Image = photo.InputStream });

            Lobby.Current.AddPlayer(nPlayer);            
            return new RedirectResult( string.Format("/Game/Lobby?eMail={0}", Server.UrlEncode( eMail ) ) );
        }

        public ActionResult GetPlayerPhoto(string eMail)
        {
            Player player;
            if ((player = Lobby.Current.LoadPlayer(eMail)) != null)
            {
                Photo dPhoto; //dPhoto = Default Photo
                if ((dPhoto = player.GetDefaultPhoto()) != null)
                {
                    dPhoto.Image.Seek(0, SeekOrigin.Begin);
                    Response.ClearContent();
                    Response.ClearHeaders();
                    Response.BufferOutput = true;
                    Response.ContentType = dPhoto.ContentType;
                    byte[] buffer = new byte[512];

                    while ((dPhoto.Image.Read(buffer, 0, buffer.Length)) > 0)
                    {
                        Response.BinaryWrite(buffer);
                    }
                }
            }

            return new EmptyResult();
        }

        public ActionResult Show(string eMail)
        {
            ViewData.Model = Lobby.Current.LoadPlayer(eMail);
            return new ViewResult() { ViewData = ViewData };
        }
    }
}
