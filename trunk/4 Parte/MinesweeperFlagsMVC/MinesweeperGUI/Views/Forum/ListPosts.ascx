<%@ Import Namespace="MinesweeperForum" %>
<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<IEnumerable<Post>>" %>

Id:<%=ViewData["thId"]%><br />
Title: <%=ViewData["title"] %>

<% foreach (Post p in Model){ %>
    <ul>
        Id:<%=p.Id %><br />
        ThreadId:<%=p.ThreadId %><br />
        Publisher:<% =p.Publisher %><br />
        Date: <%=p.AddDate %><br />
        Message: <% =p.Body %><br />
        
        <%=Html.ActionLink("Delete Post", "DeletePost", new { postId = p.Id })%>
    </ul>
<% } %>