<%@ Import Namespace="MinesweeperForum" %>

<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<IEnumerable<Thread>>" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script type="text/javascript" src="/source/ForumMVC.js"></script>
    <script type="text/javascript" src="/source/HttpRequest.js"></script>
    <script type="text/javascript" src="/source/jquery-1.3.2.js"></script>
</head>
<body onload="Forum.init('pName','eMail');">
    <div id="forumTitle">
        <h1>Forum Title</h1>
    </div>
    <div id="forumNav"></div>
    <div id="forumThreadEntry"></div>
    <div id="forumPostEntry"></div>
    <div id="forumContent"></div>
</body>
</html>
