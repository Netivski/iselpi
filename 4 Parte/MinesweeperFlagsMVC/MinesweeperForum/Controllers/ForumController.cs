using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using System.Data.Linq;

namespace MinesweeperForum.Controllers
{
    public class ForumController : Controller
    {
        private string connString = MinesweeperForum.Properties.Settings.Default.MSF_ForumConnectionString;

        public ActionResult Main()
        {
            return View();
        }

        public ActionResult ListThreads()
        {
            DataContext dc = new DataContext(connString);
            ViewData.Model = from t in dc.GetTable<Thread>() select t;
            return View();
        }

        public ActionResult ListPosts(int? thId)
        {
            DataContext dc = new DataContext(connString);
            Table<Thread> threads = dc.GetTable<Thread>();

            int currId = thId.HasValue ? thId.Value : threads.First().Id;

            ViewData["thId"] = currId;
            ViewData["Title"] = threads.Single(t => t.Id == currId).Title;

            var posts = from p in dc.GetTable<Post>()
                        where p.ThreadId == currId
                        orderby p.AddDate ascending
                        select p;

            ViewData.Model = posts;
            return View();
        }

        public ActionResult DeletePost(int? postId)
        {

            DataContext dc = new DataContext(connString);
            Table<Post> posts = dc.GetTable<Post>();

            Post target = posts.Single(p => p.Id == postId);
            int thId = target.ThreadId;

            posts.DeleteOnSubmit(target);
            dc.SubmitChanges();  
            return RedirectToAction("ListPosts", new { thId = thId });
        }

        public ActionResult AddThread(string thTitle, string eMail)
        {
            DataContext dc = new DataContext(connString);
            Table<Thread> threads = dc.GetTable<Thread>();
            
            if ((from t in threads where t.Title.Equals(thTitle) select t).Count()>0)
                return new ContentResult { Content=thTitle };

            threads.InsertOnSubmit(new Thread
            {
                AddDate = System.DateTime.Now,
                Title = thTitle,
                Publisher = eMail,
                Visits = 0
            });
            threads.Context.SubmitChanges();
            return RedirectToAction("ListThreads");
        }

        public ActionResult AddPost(int? thId, string body, string eMail)
        {
            DataContext dc = new DataContext(connString);
            Table<Post> posts = dc.GetTable<Post>();

            posts.InsertOnSubmit(new Post
            {
                ThreadId = thId.Value,
                AddDate = System.DateTime.Now,
                Body = body,
                Publisher = eMail
            });
            posts.Context.SubmitChanges();
            return RedirectToAction("ListPosts", new { thId = thId.Value });
        }
    }

}
