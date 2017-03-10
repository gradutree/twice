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
    };
	
	model.getGalleryId = function() {
		var id = window.location.href.split("/")[4].split("?")[0];
		return id;
	};
	
    model.onLoad = function() {
        
    };

    model.getImage = function(id) {
        if (id == "-1") {
				var username = window.location.href.split("/")[4].split("?")[0];
				doAjax("GET", "/api/gallery/"+username, null, true, function(err, image) {
					
					if (image.empty) {
						document.dispatchEvent(new CustomEvent("onGalleryEmpty"));
						return;
					}
					image.first = true;
					document.dispatchEvent(new CustomEvent("returnImage", {detail: image}));
				});
			
            
        } else {
            doAjax("GET", "/api/image/"+id, null, true, function(err, image) {
				
				if (err) {
                	document.dispatchEvent(new CustomEvent("onInvalidImage"));
                	return;
            	}
				image.first = true;
				document.dispatchEvent(new CustomEvent("returnImage", {detail: image}));
			});
        }
    };

    model.getUploadedImage = function(err, res) {
		res = JSON.parse(res);
		if (err) {
			document.dispatchEvent(new CustomEvent("onUploadError", {detail: err}));
			return;
		}
        doAjax("GET", "/api/image/"+res.id, null, true, function(err, data) {
			
			if (err) {
				console.log(err);
				return;
			}
			document.dispatchEvent(new CustomEvent("onUploadImage", {detail: data}));
		});

        
    };

    model.getNextImage = function(id, callback) {
		doAjax("GET", "/api/gallery/"+model.getGalleryId()+"/next/"+id, null, true, (callback) ? callback : function(err, image) {
			if (!err) {
				if (!image.message) {
					
					document.dispatchEvent(new CustomEvent("returnImage", {detail: image}));
				}
			}
		});
    };
	
	function getNextId(id) {
		var sid = parseInt(id);
        var keys = Object.keys(model.images);
        for (var i = 0; i < keys.length; i++) {
			console.log(i);
            if (keys[i] == sid) {
                return i+1 < keys.length ? keys[i+1] : -1;
            }
        }
        return -1;
	}
	
    model.getPrevImage = function(id, callback) {
        doAjax("GET", "/api/gallery/"+model.getGalleryId()+"/prev/"+id, null, true, (callback) ? callback : function(err, image) {
			if (!err) {
				if (!image.message) {
					document.dispatchEvent(new CustomEvent("returnImage", {detail: image}));
				}
			}
		});
    };
	
	function getPrevId(id) {
        var sid = parseInt(id);
        var keys = Object.keys(model.images);
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] == sid) {
                return i-1 >= 0 ? keys[i-1] : -1;
            }
        }
        return -1;
    }

    model.uploadImage = function(image) {

		var formData = new FormData();
		
		//formData.append("author", image.author);
		formData.append("title", image.title);
		formData.append("image", image.image);
		doAjax("POST", "/api/image", formData, false, model.getUploadedImage); 
		
    };

    model.newComment = function(comment) {
		var commentModel = {content: comment.content,
							imageId: comment.imageId};
		doAjax("POST", "/api/comment", commentModel, true, model.refreshComments(comment.imageId));
    };
	
	model.refreshComments = function(imageId) {
		return function rf(error, data) {
			console.log(error);
			if (error) {
				//error = JSON.parse(error);
				document.dispatchEvent(new CustomEvent("onCommentError", {detail: error}));
				return;
			}
			doAjax("GET", "/api/image/"+imageId+"/comment/1", null, true, function(err, data) {
				if (err) {
					return;
				}
				document.dispatchEvent(new CustomEvent("onSubmittedComment", {detail: {comments: data.comments, page: data.page}}));
			});
		};
	};

    model.getComments = function(filter) {
        doAjax("GET", "/api/image/"+filter.id+"/comment/"+filter.page, null, true, function(err, data) {
			if (err) {
				
				return;
			}
			document.dispatchEvent(new CustomEvent("onGetComments", {detail: {comments: data.comments, page: data.page}}));
		});

        
    };

    model.deleteImage = function(id) {
        model.getNextImage(id, function(err, image) {
			if (err) {
				return;
			}
			if (image.message) {
				model.getPrevImage(id, function(err, prevImage) {
					doAjax("DELETE", "/api/image/"+id, null, true, function(err, data) {
						if (err) {
							return;
						}
						if (prevImage.message) {
							document.dispatchEvent(new CustomEvent("onGalleryEmpty"));
							return;
						}
						document.dispatchEvent(new CustomEvent("returnImage", {detail: prevImage}));
					});
				});
				return;
			}
			doAjax("DELETE", "/api/image/"+id, null, true, function(err, data) {
				if (err) {
					return;
				}
				document.dispatchEvent(new CustomEvent("returnImage", {detail: image}));
			});
		});
    };

    model.deleteComment = function(id) {
        doAjax("DELETE", "/api/comment/"+id, null, true, function(err, data) {
			if (err) {
				return;
			}
			document.dispatchEvent(new CustomEvent("onDeletedComment"));
		});

        
    };

    return model;

}());
