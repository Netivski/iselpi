<%@ Import Namespace="Minesweeper" %>
<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<Player>" %>

<!DOCTYPE html>
<html>
<head>
    <link type="text/css" href="http://jqueryui.com/latest/themes/base/ui.all.css" rel="stylesheet" />
	<link type="text/css" href="/Source/Lobby.css" rel="Stylesheet" />

    <script type="text/javascript" src="/Source/jquery-1.3.2.js"></script>

    <script type="text/javascript" src="/Source/ui.core.js"></script>

    <script type="text/javascript" src="/Source/ui.tabs.js"></script>
	<script type="text/javascript" src="/source/LobbyMVC.js"></script>
	<script type="text/javascript" src="/source/HttpRequest.js"></script>
	<script type="text/javascript" src="/source/Constants.js"></script>

    <script type="text/javascript">
        var tabId = "#tabs";
        var tabElementsCount;

        $(document).ready(function() {
            $(tabId).tabs();
            tabElementsCount = $(tabId).tabs('length');
        });

        function addTab(url, label) {
            $(tabId).tabs('add', url, label);
            $(tabId).bind('tabsselect', function(event, ui) {
                if (ui.index > (tabElementsCount - 1) && ui.panel.innerHTML.length > 0) {
                    $(tabId).tabs('url', ui.index, "");
                }
            });
        }

        function doSeelect() {
            var e = $("#mainP");
            alert($("#mainP").innerHTML);
        }
        
    </script>
</head>
<body style="font-size: 62.5%;" onload="Lobby.init('<%=Model.Name %>','<%=Model.EMail%>');">
    <div id="tabs">
        <ul>
            <li><a href="#lobby"><span>Lobby</span></a></li>
        </ul>
        <div id="lobby">
            <div class="divBackGround">
                <div class="divTabList">
                    <div class="divTab"></div>
                    <div class="divTab"></div>
                    <div class="divTab"></div>
                    <div class="divTab"></div>
                </div>
                <div class="divPlayerInfo">
                    <div class="divTitles">My Information</div>
                    <div class="divPhoto"></div>
                    <div class="divPlayerName"></div>
                    <div class="divPlayerOptions">
                        <div class="divTitles">Menu</div>
                    </div>
			        <div class="divPlayerFriendsList">
			            <div class="divTitles">My Friends</div>
			            <dl id="frList"></dl>
			        </div>
                </div>
                <div class="divCommunication">
                    <div class="divTitles">Communications</div>
                    <div class="divInviteBoard">
                        <div class="divTitles">Incoming Invites</div>
                        <dl id="invList"></dl>
                    </div>
                    <div class="divMessageBoard">
                        <div class="divTitles">Message Box</div>
                        <textarea cols="20" id="msgBoard" readonly="readonly" rows="20"></textarea>
                    </div>
                    <div class="divPlayerMessage">
                        <div class="divTitles">Message</div>
                        <textarea cols="20" rows="20" id="msgInput"></textarea>
                        <input type="button" id="SendPrivate" value="Send To" />
                        <select id="msgDestList"/>
                        <input type="button" id="SendAll"value="Send To All" />
                    </div>
                </div>
                <div class="divOnLists">
                    <div class="divTitles">Online Board</div>
                    <div class="divPlayersOnList">
                        <div class="divTitles">Players Online</div>
                        <dl id="plList"></dl>
                    </div>           
                    <div class="divGameOnList">
                        <div class="divTitles">Games Available</div>
                        <dl id="gList"></dl>
                    </div>
                </div>        
            </div>
        </div>
    </div>
    <input type="button" value="Add New Tab" onclick="javascript:addTab('/GameAsynchronous/GameBoard', 'Game');" />
</body>
</html>