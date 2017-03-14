(function () {
    "use strict";
	
    var onLoad = function () {
        model.onLoad();
        view.onLoad();
    };
	
	// document.addEventListener("onGallerySubmit", function(e) {
		// model.createGallery(e.detail);
	// });
	
	// document.addEventListener("onSubmitSuccess", function(e) {
		// view.refreshGallery();
	// });
	
	document.addEventListener("onGetGallery", function(e) {
		model.getImages();
	});
	
	document.addEventListener("onGalleryClick", function(e) {
		model.getGallery();
	});
	
	document.addEventListener("onGetUsername", function(e) {
		view.goGallery(e.detail);
	});
	
	document.addEventListener("onReturnImages", function(e) {
		view.refreshGallery(e.detail);
	});

	document.addEventListener("onGetBrowse", function(e) {
		model.getBrowse(e.detail);
	});
	
	document.addEventListener("onReturnBrowse", function(e) {
		view.setBrowse(e.detail);
	});
	
	document.addEventListener("onGetThumbnail", function(e) {
		model.getThumbnail(e.detail);
	});
	
	document.addEventListener("onReturnThumbnail", function(e) {
		view.setThumbnail(e.detail);
	});

    window.onload = onLoad;
}());