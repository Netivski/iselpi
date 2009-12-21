<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Tab.aspx.cs" Inherits="MinesweeperGUI.Debug.Tab" %>

<!DOCTYPE html>
<html>
<head>
  <link type="text/css" href="http://jqueryui.com/latest/themes/base/ui.all.css" rel="stylesheet" />
  <script type="text/javascript" src="/Source/jquery-1.3.2.js"></script>
  <script type="text/javascript" src="/Source/ui.core.js"></script>
  <script type="text/javascript" src="/Source/ui.tabs.js"></script>
  <script type="text/javascript">
      var tabId = "#tabs";
      var tabElementsCount;
      $(document).ready(function() {
          $(tabId).tabs();
          tabElementsCount = $(tabId).tabs('length');
      });

function addTab( url, label ) {
    $(tabId).tabs('add', url, label );
    $(tabId).bind('tabsselect', function(event, ui) {
        if (ui.index > (tabElementsCount - 1) && ui.panel.innerHTML.length > 0) {
            $(tabId).tabs('url', ui.index, "");
        }
    });    

    return false;
}
  
  </script>
</head>
<body style="font-size:62.5%;">
<div id="tabs">
    <ul>
        <li><a href="#lobby"><span>Eng. Rirdo Neto</span></a></li>
    </ul>
    <div id="lobby">
        <p>Eng. Ricardo Neto - O html do lobby é aqui</p>
        <pre><code>Sim.... aqui!!!!</code></pre>
    </div>
</div>
<input type="button" value="Add New Tab" onclick="javascript:addTab('/GameAsynchronous/GameBoard', 'Game');" />
<br/>
<%= DateTime.Now.ToString() %>
</body>
</html>