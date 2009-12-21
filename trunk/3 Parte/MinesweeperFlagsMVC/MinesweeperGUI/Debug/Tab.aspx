﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Tab.aspx.cs" Inherits="MinesweeperGUI.Debug.Tab" %>

<!DOCTYPE html>
<html>
<head>
  <link type="text/css" href="http://jqueryui.com/latest/themes/base/ui.all.css" rel="stylesheet" />
  <script type="text/javascript" src="/Source/jquery-1.3.2.js"></script>
  <script type="text/javascript" src="/Source/ui.core.js"></script>
  <script type="text/javascript" src="/Source/ui.tabs.js"></script>
  <script type="text/javascript">
  $(document).ready(function(){
    $("#tabs").tabs();
});

function addNewTab() {
    var tabElementsCount = $("#tabs").tabs('length');
    
    $("#tabs").tabs('add', "/GameAsynchronous/GameBoard", "Game");
    $('#tabs').bind('tabsselect', function(event, ui) {
        if (ui.index > 2 && ui.panel.innerHTML.length > 0) {
            $("#tabs").tabs('url', ui.index, "");
        }
    });    

    return false;
}
  
  </script>
</head>
<body style="font-size:62.5%;">
<div id="tabs">
    <ul>
        <li><a href="#fragment-1"><span>One</span></a></li>
        <li><a href="#fragment-2"><span>Two</span></a></li>
        <li><a href="#fragment-3"><span>Three</span></a></li>
    </ul>
    <div id="fragment-1">
        <p>First tab is active by default:</p>
        <pre><code>$('#example').tabs();</code></pre>
    </div>
    <div id="fragment-2">
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
    </div>
    <div id="fragment-3">
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
    </div>
</div>
<input type="button" value="Add New Tab" onclick="javascript:addNewTab();" />
<br/>
<%= DateTime.Now.ToString() %>
</body>
</html>