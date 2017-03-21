// JavaScript Document


	document.getElementById("profile").addEventListener("click", function(e) {
		var popover = document.getElementById("popover-arrow");
		if (popover.classList.contains("hidden")) {
			popover.classList.remove("hidden");
		}
		else {
			popover.classList.add("hidden");
		}
	});
