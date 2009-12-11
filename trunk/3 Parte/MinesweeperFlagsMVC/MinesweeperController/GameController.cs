using System.Web.Mvc;

namespace MinesweeperControllers
{
    public class GameController : MinesweeperBaseController
    {
        public ActionResult Show()
        {
            return View();
        }
    }
}
