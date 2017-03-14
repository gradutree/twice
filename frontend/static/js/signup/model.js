var model = (function(){
    "use strict";
    var model = {};
	
	var doAjax = function (method, url, body, json, callback){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(e){
            switch(this.readyState){
                 case (XMLHttpRequest.DONE):
                    if (this.status === 200) {
                        if(json) return callback(null, JSON.parse(this.responseText));
                        return callback(null, this.responseText);
                    }else{
                        return callback(this.responseText, null);
                    }
            }
        };
        xhttp.open(method, url, true);
        if (json && body){
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send(JSON.stringify(body));  
        }else{
            xhttp.send(body);  
        }        
    };
	
    model.onLoad = function() {
        
    };

    model.signup = function(detail) {
		doAjax("POST", "/api/user", detail, true, function(err, res) {
			if (err) {
				return document.dispatchEvent(new CustomEvent("OnSignUpFail", {detail: err}));
			}
			document.dispatchEvent(new CustomEvent("onSignUpSuccess"));
		});
	};

    return model;

}());
