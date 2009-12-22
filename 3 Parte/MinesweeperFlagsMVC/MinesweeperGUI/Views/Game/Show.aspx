<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage" %>
<%@ Import Namespace="MinesweeperGUI.ExtensionMethods" %>

<script type="text/javascript">
        var <%=ViewData["gKey"]%> = null;        
        $(document).ready(function() {
            <%=ViewData["gKey"]%> = new GameMVC(LINES, COLS, "<%=ViewData["gKey"]%>");
            <%=ViewData["gKey"]%>.init();
            <%=ViewData["gKey"]%>.gameController.startGame("<%= Html.Encode(ViewData["gName"])%>", "<%= Html.Encode(ViewData["pName"])%>", "<%= Html.Encode(ViewData["pEMail"])%>", <%= Html.Encode(ViewData["pId"])%>, <%=Html.Encode(Html.JavaScriptBooleanValue((bool)ViewData["isOwner"]))%> );
        });
</script>

<div class="divBackGround">
    <div id="divPlayerBoard" class="divPlayerBoard">
    </div>
    <div id="divArena" class="divArena">
    </div>
    <div id="divScoreBoard" class="divScoreBoard">
        <div class="divScoreLabel">
        </div>
        <div class="divScoreValue">
        </div>
    </div>
    <div class="divOptions">
    </div>
    <div id="divMessageBoard" class="divMessageBoard">
        <div class="divMessage">.: GR9 - MineSweeper Two Thousand And a Half :.</div>
    </div>
</div>
