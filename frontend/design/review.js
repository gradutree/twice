// JavaScript Document

document.getElementById("review_toggle").addEventListener("click", function(e) {
	var text = document.getElementById("review_area");
	var footer = document.getElementById("review_footer");
	var arrow = document.getElementById("popover-arrow");
	if (this.classList.contains("review_toggle_active")) {
		this.classList.remove("review_toggle_active");
		text.classList.add("hidden");
		arrow.classList.add("hidden");
		footer.classList.add("hidden");
	} else {
		this.classList.add("review_toggle_active");
		text.classList.remove("hidden");
		arrow.classList.remove("hidden");
		footer.classList.remove("hidden");
	}
});

document.getElementById("cancel_review").addEventListener("click", function(e) {
	var text = document.getElementById("review_area");
	var footer = document.getElementById("review_footer");
	var arrow = document.getElementById("popover-arrow");
	var toggle = document.getElementById("review_toggle");
	toggle.classList.remove("review_toggle_active");
	text.classList.add("hidden");
	arrow.classList.add("hidden");
	footer.classList.add("hidden");
});