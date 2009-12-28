using System;
using System.Web;
using System.Web.Mvc;
using System.IO;
using Minesweeper;


namespace MinesweeperControllers
{
    public class ProfileController : GameBaseController
    {
        public ActionResult Create()
        {
            ViewData["message"] = "";
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Create(string eMail, string name, bool online)
        {
            HttpPostedFileBase photo = Request.Files[0];
            if (Lobby.Current.LoadPlayer(eMail) != null)
            {
                ViewData["message"] = "E-mail " + eMail + " already registered!";
                return View();
            }
            Player nPlayer; // nPlayer == New Player
            nPlayer = new Player(name, eMail);
            nPlayer.Status = (online ? PlayerStatus.Online : PlayerStatus.Offline);
            if (photo != null) nPlayer.AddPhoto(new Photo() { Name = photo.FileName, ContentType = photo.ContentType, Image = photo.InputStream });
            Lobby.Current.AddPlayer(nPlayer);

            return new RedirectResult(string.Format("/Game/Start?message={0}", "E-mail " + eMail + " registered!"));
        }

        public ActionResult GetPlayerPhoto(string eMail)
        {
            Player player;
            if ((player = Lobby.Current.GetPlayer(eMail)) != null)
            {
                Photo dPhoto; //dPhoto = Default Photo
                if ((dPhoto = player.GetDefaultPhoto()) != null)
                {
                    if (dPhoto.Image != null)
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
            }

            return new EmptyResult();
        }

        public ActionResult Edit(string eMail)
        {
            ViewData.Model = Lobby.Current.LoadPlayer(eMail);
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Edit(string eMail, string name, bool online)
        {
            return Create(eMail, name, online);
        }
    }
}
