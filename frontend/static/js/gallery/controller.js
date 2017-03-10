(function () {
    "use strict";

    document.addEventListener("onUploadSubmit", function (e) {
        model.uploadImage(e.detail);
    });

    document.addEventListener("onUploadImage", function (e) {
        view.setUploaded(e.detail);
    });

    document.addEventListener("getImage", function (e) {
        model.getImage(e.detail);
    });

    document.addEventListener("returnImage", function (e) {
        view.setNewImage(e.detail);
    });

    document.addEventListener("onCommentSubmit", function (e) {
        model.newComment(e.detail);
    });

    document.addEventListener("onGetComments", function (e) {
        view.setComments(e.detail);
    });

    document.addEventListener("getComments", function (e) {
        model.getComments(e.detail);
    });

    document.addEventListener("onDeleteImagePress", function (e) {
        model.deleteImage(e.detail);
    });

    document.addEventListener("onInvalidImage", function (e) {
        view.set404();
    });

    document.addEventListener("onGalleryEmpty", function (e) {
        view.setEmpty();
    });

    document.addEventListener("onDeletedImage", function (e) {
        view.imageDeleted();
    });

    document.addEventListener("onDeleteCommentPressed", function (e) {
        model.deleteComment(e.detail);
    });

    document.addEventListener("onDeletedComment", function (e) {
        view.refreshComments();
    });
	
	document.addEventListener("onUploadError", function (e) {
        view.setUploadError(e.detail);
    });
	
	document.addEventListener("onSubmittedComment", function (e) {
        view.setNewComment(e.detail);
    });
	
	document.addEventListener("onCommentError", function (e) {
        view.setCommentError(e.detail);
    });
	
	document.addEventListener("onCheckUsername", function (e) {
        model.getActiveUsername(e.detail);
    });
	
	document.addEventListener("getNextImage", function(e) {
		model.getNextImage(e.detail); 
	});
	
	document.addEventListener("getPrevImage", function(e) {
		model.getPrevImage(e.detail); 
	});

    var onLoad = function () {
        model.onLoad();
        view.onLoad();
    };

    window.onload = onLoad;
}());