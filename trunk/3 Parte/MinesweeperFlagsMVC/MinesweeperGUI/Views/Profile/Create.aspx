<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<Minesweeper.Player>" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">	
<html>
<head id="Head1" runat="server">
    <title>Board Tests</title>
    <script type="text/javascript" src="~/Source/GameMVC.js"></script>
    <script type="text/javascript" src="~/Source/jquery-1.3.2.js"></script>	
    <link rel="Stylesheet" type="text/css" href="~/Source/mineSweeper.css" />	
</head>
<body>
  <h1>Adicionar Perfil</h1>
  
  <div>
    <form method="post" id="createProfile" enctype="multipart/form-data">
    E-Mail:
    <input type="text" name="eMail" value="<%=Model.EMail%>" />
    <br />
    Name:
    <input type="text" name="name" value="<%=Model.Name%>" />
    <br />
    Online:    
    <input type="checkbox" name="online" <%# Model.Online ? "checked=\"checked\"": "" %> />
    <br />
    Photo:
    <input type="file" name="photo" />
    <%if (Model.EMail != null){ %>
     Photo: <img src="/Profile/GetPlayerPhoto?eMail=<%=Model.EMail%>" />    
    <%} %>
     
    <br />
    <input type="submit" value="Save Profile" />
    </form>
  </div> 
</body>
</html>