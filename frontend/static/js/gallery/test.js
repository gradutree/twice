(function () {
	"use strict";

	var testImages = ["https://static.pexels.com/photos/159737/books-learn-bible-notes-159737.jpeg",
					  "https://static.pexels.com/photos/236129/pexels-photo-236129.jpeg",
					 "https://static.pexels.com/photos/210627/pexels-photo-210627.jpeg",
					 "https://static.pexels.com/photos/208165/pexels-photo-208165.jpeg",
					 "https://static.pexels.com/photos/309850/pexels-photo-309850.jpeg",
					 "https://static.pexels.com/photos/285173/pexels-photo-285173.jpeg",
					 "https://static.pexels.com/photos/309742/pexels-photo-309742.jpeg"];
	
	function loadTests() {
		testImages.forEach(function(item, i) {
			var image = {};
			image.title = "Test image "+i;
			image.image = item;
			document.dispatchEvent(new CustomEvent("onUploadSubmit", {detail: image}));
		});
	}
	var li = document.createElement("li");
	
	var testBtn = document.createElement("div");
	testBtn.className = "test";
	testBtn.addEventListener("click", loadTests);
	testBtn.innerHTML = "Load test images";
	li.append(testBtn);
	var list = document.getElementById("btn_list");
	list.prepend(li);

}());
