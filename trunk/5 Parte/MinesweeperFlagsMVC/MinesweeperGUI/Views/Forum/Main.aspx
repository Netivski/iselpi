<%@ Import Namespace="MinesweeperForum" %>
<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<IEnumerable<Thread>>" %>
<%--    <link rel="Stylesheet" type="text/css" href="/Source/Forum.css" />
    <script type="text/javascript" src="/Source/jquery-1.3.2.js"></script>
    <script type="text/javascript" src="/source/ForumMVC.js"></script>
    <script type="text/javascript" src="/source/HttpRequest.js"></script>
--%>
<script type="text/javascript">
    $(document).ready(function() {
        Forum.init();
    });
</script>

<div id="forumBackground" class="forumBackground">
    <div id="forumTitle" class="forumTitle">
        <h1>MineSweeper Two Thousand And a Half Forum</h1>
    </div>
    <div class="forumLeftBar">
        <div id="forumNav" class="forumNav"></div>
        <div id="forumThreadEntry" class="forumThreadEntry"></div>
        <div id="forumPostEntry" class="forumPostEntry"></div>
    </div>
    <div id="forumContent" class="forumContent"></div>
</div>
