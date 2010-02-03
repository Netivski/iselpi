<%@ Import Namespace="MinesweeperForum" %>
<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<IEnumerable<Thread>>" %>

<%foreach (Thread t in Model){%>
    <dl>
        Id:<a href="javascript:ForumController.evtListPosts('<%=t.Id%>');"><%=t.Id %></a><br />
        Title:<%=t.Title %><br />
        Publisher:<%=t.Publisher %><br />
        Date:<%=t.AddDate %><br />
        Views:<%=t.Visits %><br />
    </dl>
<%} %>
