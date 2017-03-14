var view = (function () {
	"use strict";

	var view = {};
	view.overlayOpen = false;
	view.msnry = null;

	view.onLoad = function () {
		view.msnry = new Masonry( '#gallery_images', {
						itemSelector: '.box',
						columnWidth: 6
					});
		document.dispatchEvent(new CustomEvent("onGetGallery"));
		document.dispatchEvent(new CustomEvent("onGetBrowse", {detail: "recent"}));
		document.dispatchEvent(new CustomEvent("onGetBrowse", {detail: "top"}));
	};

	
	document.getElementById("start_btn").addEventListener("click", function(e) {
		document.dispatchEvent(new CustomEvent("onGalleryClick"));
	});
	
	view.refreshGallery = function(images) {
		
		if (images.empty) {
			return;
		}
		document.getElementById("empty_gallery").classList.add("hidden");
			
		view.loadImage(images, 0);

		
	};
	
	view.loadImage = function(items, i) {
		if (i >= items.length) {
			return;
		}
		var grid = document.getElementById("gallery_images");
		var art = document.createElement("article");
		var img = document.createElement("img");
		var preload = new Image();
		preload.onload = function() {
			img.src = "/cdn/"+items[i].filename;
		};
		var anc = document.createElement("a");
		anc.href = "/gallery/"+items[i].author+"?id="+items[i]._id;
		img.classList.add("thumbnail");
		art.classList.add("box");
		anc.appendChild(img);
		art.appendChild(anc);
		grid.appendChild(art);
		view.msnry.appended(art);
		img.onload = function() {
			view.msnry.layout();
			view.loadImage(items, i+1);
		};
		preload.src = "/cdn/"+items[i].filename;
	};
	
	view.goGallery = function(username) {
		window.location.href = "/gallery/"+username;
	};
	
	view.setBrowse = function(data) {
		var id = data.filter+"_box";
		var box = document.getElementById(id);
		data.data.forEach(function(item, i) {
			var empty = document.getElementById("browse_empty_"+data.filter);
			if (empty) {
				empty.remove();
			}
			var art = document.createElement("article");
			var img = document.createElement("img");
			var anc = document.createElement("a");
			var overlay = document.createElement("div");
			overlay.classList.add("item_info");
			overlay.innerHTML = ("<h3>"+item.owner+"'s gallery</h3>").toUpperCase();
			anc.href = "/gallery/"+item.owner;
			art.classList.add("gallery_article");
			img.classList.add("gallery_box");
			img.id = data.filter+"_thumbnail_"+item.owner;
			anc.appendChild(img);
			art.appendChild(anc);
			anc.appendChild(overlay);
			box.appendChild(art);
			document.dispatchEvent(new CustomEvent("onGetThumbnail", {detail: {owner: item.owner, filter: data.filter}}));
		});
	};
	
	view.setThumbnail = function(image) {
		var id = image.filter+"_thumbnail_"+image.author;
		var img = document.getElementById(id);
		if (image.empty) {
			img.src = "/media/transparent.png";
			return;
		}

		img.src = "/cdn/"+image.filename;
	};

	return view;

}());
