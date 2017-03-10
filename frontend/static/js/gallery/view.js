var view = (function(){
    "use strict";

    var view = {};

    view.overlayOpen = false;
    view.currentId = -1;
    view.commentPage = 0;

    view.setUploaded = function(image) {
		view.closeOverlay();
		var form = document.getElementById("upload_form");
		form.reset();
		document.getElementById("url_input").classList.add("hidden");
		document.getElementById("file_input").classList.add("hidden");
		var err_msg = document.getElementById("upload_msg");
		err_msg.innerHTML = "";
        view.setNewImage(image);
    };

    view.setNewImage = function(image, noPush) {
        if (!image.filename) {
			view.set404();
			return;
		}
        view.currentId = image._id;
        var imgBox = document.getElementById("image_box");
        imgBox.src = "/cdn/"+image.filename;
        var imgTitle = document.getElementById("image_title");
        imgTitle.innerHTML = image.title;
        var imgAuthor = document.getElementById("image_author");
        imgAuthor.innerHTML = "By: "+image.author;
		
		document.dispatchEvent(new CustomEvent("onCheckUsername", {detail: function(err, username) {
			if (username != image.author) {
				var del = document.getElementById("delete_image");
				if (del) del.remove();
			}
		}}));
		
		if (image.first) {
			history.replaceState(image, "", "?id="+image._id);
		} else if (!noPush) {
			history.pushState(image, "", "?id="+image._id);
		}
		displayElements();
		var commentBox = document.getElementById("comment_box");
		commentBox.innerHTML = "";
		var btns = document.getElementById("comment_nav");
		btns.style.display = "none";
        document.dispatchEvent(new CustomEvent("getComments", {detail: {id: view.currentId, page: 1}}));
		
    };

    view.closeOverlay = function() {
        var overlay = document.getElementById("overlay");
        view.overlayOpen = false;
        overlay.style.width = "0%";
    };

    view.onLoad = function() {
        var query = document.URL.split("?");
        var pat = /id=.+/;
        var id = "-1";
        if (query.length != 1) {
            id = pat.test(query[1]) ? pat.exec(query[1])[0].split("=")[1] : "-1";	
        }
		
		var owner = window.location.href.split("/")[4].split("?")[0];
		

		
		document.getElementById("overlay").addEventListener("click", function(e) {
			var form = document.getElementById("upload_form");
			if (!form.contains(e.target)) {
				view.overlayOpen = false;
				this.style.width = "0%";
			}
		});

		document.getElementById("toggle_upload").addEventListener("click", function(e) {
			if (!view.overlayOpen) {
				view.overlayOpen = true;
				document.getElementById("overlay").style.width = "100%";
			} else {
				view.overlayOpen = false;
				document.getElementById("overlay").style.width = "0%";
			}
		});
		
		document.dispatchEvent(new CustomEvent("onCheckUsername", {detail: function(err, username) {
			if (username != owner) {
				document.getElementById("toggle_upload").remove();
			}
		}}));

		document.getElementById("upload_form").addEventListener("submit", function(e) {
			e.preventDefault();
			var isSelected = document.querySelector('input[name="upload"]:checked');
			if (!isSelected) {
				return;
			}
			var file;
			var title;
			var author;
			var image;
			if (isSelected.value == "choose") {
				file = document.getElementById("file_input").files;
				title = document.getElementById("title_input").value;
				//author = document.getElementById("uploader_input").value;
				image = {};
				image.title = title;
				//image.author = author;
				image.image = file[0];
				document.dispatchEvent(new CustomEvent("onUploadSubmit", {detail: image}));

			} else {
				file = document.getElementById("url_input").value;
				title = document.getElementById("title_input").value;
				//author = document.getElementById("uploader_input").value;
				image = {};
				image.title = title;
				image.image = file;
				//image.author = author;
				document.dispatchEvent(new CustomEvent("onUploadSubmit", {detail: image}));
			}
		});

		document.getElementById("choose").addEventListener("click", function(e) {
			var isOpen = !document.getElementById("url_input").classList.contains("hidden");
			if (isOpen) {
				document.getElementById("url_input").classList.add("hidden");
			}
			document.getElementById("file_input").classList.remove("hidden");
		});

		document.getElementById("url").addEventListener("click", function(e) {
			var isOpen = !document.getElementById("file_input").classList.contains("hidden");

			if (isOpen) {
				document.getElementById("file_input").classList.add("hidden");
			}
			document.getElementById("url_input").classList.remove("hidden");
		});

		document.getElementById("comment_form").addEventListener("submit", function(e) {
			e.preventDefault();
			//var author = document.getElementById("author_input").value;
			var content = document.getElementById("message_input").value;
			var commentModel = {content: content,
								imageId: view.currentId};
			document.dispatchEvent(new CustomEvent("onCommentSubmit", {detail: commentModel}));
		});

		document.getElementById("prev_comments").addEventListener("click", function(e) {
			document.dispatchEvent(new CustomEvent("getComments", {detail: {id: view.currentId, page: view.commentPage-1}}));
		});

		document.getElementById("next_comments").addEventListener("click", function(e) {
			document.dispatchEvent(new CustomEvent("getComments", {detail: {id: view.currentId, page: view.commentPage+1}}));
		});
		
		document.getElementById("next").addEventListener("click", function(e) {
			document.dispatchEvent(new CustomEvent("getNextImage", {detail: view.currentId}));
		});
			
		document.getElementById("prev").addEventListener("click", function(e) {
			document.dispatchEvent(new CustomEvent("getPrevImage", {detail: view.currentId}));
		});
		
		document.getElementById("delete_image").addEventListener("click", function(e) {
		
		   document.dispatchEvent(new CustomEvent("onDeleteImagePress", {detail: view.currentId}));
		});

        document.dispatchEvent(new CustomEvent("getImage", {detail: id}));

    };

    
	
	view.setNewComment = function(comments) {
		var form = document.getElementById("comment_form");
		form.reset();
		view.setComments(comments);
	};

    view.setComments = function(commentsModel) {
		var err_msg = document.getElementById("comment_err");
		err_msg.innerHTML = "";
        var comments = commentsModel.comments;
        var commentBox = document.getElementById("comment_box");
        var btns = document.getElementById("comment_nav");
        if (comments.length == 0) {		
            return;
        }
        btns.style.display = "flex";
        view.commentPage = parseInt(commentsModel.page);
        commentBox.innerHTML = "";
        comments.forEach(function(item, i) {
            var comment = document.createElement("div");
            comment.className = "comment flex_col";
            comment.innerHTML = `<div class="flex-row flex_spaceb">
                                        <div class="comment_author flex-row flex_start">
                                        <img src="/media/user.png">
                                        <div class="author_name">${item.author} says:</div>
                                        <div id="comment_time">${new Date(item.createdAt).toLocaleString()}</div>
                                     </div>
                                    <div id="delComment_${item._id}" class="del_btn">Delete</div>
                                </div>
                                  <div class="comment_message">${item.content}</div>`;
            commentBox.append(comment);
            var del = document.getElementById("delComment_"+item._id);
			document.dispatchEvent(new CustomEvent("onCheckUsername", {detail: function(err, username) {
				var galleryId = window.location.href.split("/")[4].split("?")[0];
				if (username != item.author && username != galleryId) {
					del.remove();
				} else {
					del.addEventListener("click", function(e) {
						document.dispatchEvent(new CustomEvent("onDeleteCommentPressed", {detail: item._id}));
					});
				}
			}}));
            
        });
    };

    view.set404 = function() {
        var imgTitle = document.getElementById("image_title");
        imgTitle.innerHTML = "<h3>404 Image not found</h3>";
		var imgBox = document.getElementById("image_box");
		imgBox.style.display = "none";
		var imgAuthor = document.getElementById("image_author");
		imgAuthor.style.display = "none";
        var del = document.getElementById("delete_image");
        del.style.display = "none";
        var prev = document.getElementById("prev");
        prev.style.display = "none";
        var next = document.getElementById("next");
        next.style.display = "none";
        var form = document.getElementById("comment_section");
        form.style.display = "none";
    };

    view.setEmpty = function() {
		resetElements();
        var imgTitle = document.getElementById("image_title");
        imgTitle.innerHTML = "<h3>This gallery is empty</h3>";
        var del = document.getElementById("delete_image");
        if (del) del.style.display = "none";
        var prev = document.getElementById("prev");
        prev.style.display = "none";
        var next = document.getElementById("next");
        next.style.display = "none";
        var form = document.getElementById("comment_section");
        form.style.display = "none";
    };
	
	function resetElements() {
		var imgBox = document.getElementById("image_box");
		imgBox.style.display = "none";
		var author = document.getElementById("image_author");
		author.innerHTML = "";
	}
	
	function displayElements() {
		var imgBox = document.getElementById("image_box");
		imgBox.removeAttribute("style");
		var imgAuthor = document.getElementById("image_author");
		imgAuthor.removeAttribute("style");
		var del = document.getElementById("delete_image");
		if (del) del.removeAttribute("style");
        var prev = document.getElementById("prev");
        prev.removeAttribute("style");
        var next = document.getElementById("next");
        next.removeAttribute("style");
        var form = document.getElementById("comment_section");
        form.removeAttribute("style");
	}

    view.imageDeleted = function() {
        
    };

    view.refreshComments = function() {
		var commentBox = document.getElementById("comment_box");
		commentBox.innerHTML = "";
		var btns = document.getElementById("comment_nav");
		btns.style.display = "none";
        document.dispatchEvent(new CustomEvent("getComments", {detail: {id: view.currentId, page: view.commentPage}}));
    };
	
	
	
	view.setUploadError = function(err) {
		var err_msg = document.getElementById("upload_msg");
		err_msg.innerHTML = err;
	};
	
	view.setCommentError = function(err) {
		var err_msg = document.getElementById("comment_err");
		err_msg.innerHTML = err;
	};
	
	window.onpopstate = function(event) {
		if (!event.state) return;
		view.setNewImage(event.state, true);
	};

    return view;

}());
