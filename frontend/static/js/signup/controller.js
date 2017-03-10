(function () {
    "use strict";
	
    var onLoad = function () {
        model.onLoad();
        view.onLoad();
    };
	
	document.addEventListener("onSignUpSubmit", function(e) {
		model.signup(e.detail);
	});
	
	document.addEventListener("onSignUpSuccess", function(e) {
		view.suSuccess();
	});
	
	document.addEventListener("OnSignUpFail", function(e) {
		view.suFail(e.detail);
	});
	

    window.onload = onLoad;
}());