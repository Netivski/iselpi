function HttpRequest(handlerUrl, gName, playerId) {

    var xhr;
    var _args = arguments;

    this.Request = function() {
        xhr = new XMLHttpRequest();

        //        xhr.onreadystatechange = function() {
        //            if (xhr.readyState == 4 && xhr.status == 200) {
        //                //alert(xhr.responseText);
        //            }
        //        }


        var data = "";
        
        for (var i = 3; i < _args.length; i += 2) {
            data += "&" + _args[i] + "=" + escape(_args[i + 1]);
        }
        var gChannel = "../" + handlerUrl + ".ashx"
                                                + "?gName=" + escape(gName)
                                                + "&playerId=" + escape(playerId)
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
      return eval( "(" + xhr.responseText + ")" );
    }

    this.getResponseText = function() { return xhr.responseText; }
}