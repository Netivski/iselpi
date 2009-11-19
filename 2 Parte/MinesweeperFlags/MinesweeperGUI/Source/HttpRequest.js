function HttpRequest( handlerUrl, gName, playerName, playerId  ) {
    var xhr;

    this.Request = function() {
        xhr = new XMLHttpRequest();
       
//        xhr.onreadystatechange = function() {
//            if (xhr.readyState == 4 && xhr.status == 200) {
//                //alert(xhr.responseText);
//            }
//        }


        var data = "";
        for (var i = 0; i < arguments.length; i += 2) {
            data += "&" + arguments[i] + "=" + escape(arguments[i + 1]);
        }
        
        var gChannel = "../" + handlerUrl + ".ashx"
                                                +"?gName="       + escape(gName) 
                                                + "&playerId="   + escape(playerId) 
                                                + "&playerName=" + escape(playerName) 
                                                + data;

        xhr.open("GET", gChannel, false);
        xhr.send();
        if (xhr.status != 200) throw (xhr.responseText);  
    }

    this.isTrue = function() {
        return xhr.responseText == "True";
    }

    this.isFalse = function() {
        return !this.isTrue();
    }

    this.getJSonObject = function() {
      return eval(xhr.responseText);
    }

    this.getResponseText = function() { return xhr.responseText; }
}