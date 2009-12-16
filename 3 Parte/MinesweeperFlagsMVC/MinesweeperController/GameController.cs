using System.Web.Mvc;

namespace MinesweeperControllers
{
    public class GameController : GameBaseController
    {
        public ActionResult Show()
        {
            return View();
        }

        public ActionResult Lobby()
        {
            return View();
        }
    }
}
