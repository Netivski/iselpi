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
        public ActionResult Create( string eMail, string name, byte[] photo )
        {
            // A Foto vem na propriedade Request.Files[0]

            // Para remover - Teste
            if (Request.Files.Count > 0)
            {
                Request.Files[0].SaveAs( Path.Combine( @"c:\temp\", Request.Files[0].FileName ));
            }

            ViewData.Model = new Player(name, eMail, photo); 
            return new ViewResult() { ViewData = ViewData };
        }

    }
}
