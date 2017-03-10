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
	
	model.getActiveUsername = function(callback){
        var keyValuePairs = document.cookie.split('; ');
        for(var i in keyValuePairs){
            var keyValue = keyValuePairs[i].split('=');
            if(keyValue[0]=== 'username') return callback(null, keyValue[1]);
        }
        return callback("No active user", null);
    }
	
    model.onLoad = function() {
        
    };
	
	model.createGallery = function(title) {
		doAjax("POST", "/api/gallery", {title: title}, true, function(err, res) {
			if (err) return;
			document.dispatchEvent(new CustomEvent("onSubmitSuccess"));
		});
	};
	
	model.getGallery = function() {
		model.getActiveUsername(function(err, username) {
			if (err) return;
			document.dispatchEvent(new CustomEvent("onGetUsername", {detail: username}));
		});
	};
	
	model.getImages = function() {
		model.getActiveUsername(function(err, username) {
			if (err) return;
			doAjax("GET", "/api/gallery/"+username+"/preview", null, true, function(error, data) {
				if (error) return;
				document.dispatchEvent(new CustomEvent("onReturnImages", {detail: data}));
			});
		});
	};
	
	model.getBrowse = function(filter) {
		doAjax("GET", "/api/browse/"+filter, null, true, function(err, data) {
			if (err) return;
			document.dispatchEvent(new CustomEvent("onReturnBrowse", {detail: {data: data, filter: filter}}));
		});
	};
	
	model.getThumbnail = function(data) {
		doAjax("GET", "/api/gallery/"+data.owner, null, true, function(err, image) {
			if (err) return;
			image.filter = data.filter;
			if (image.empty) {
				image.author = data.owner;
			}
			document.dispatchEvent(new CustomEvent("onReturnThumbnail", {detail: image}));
		});
	};
	
    return model;

}());
