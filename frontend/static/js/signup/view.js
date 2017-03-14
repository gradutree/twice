var view = (function(){
    "use strict";

    var view = {};

    view.onLoad = function() {

    };
	
	document.getElementById("uname_input").oninvalid = function() {
		this.parentElement.classList.add("error");
	};
	
	document.getElementById("uname_input").onchange = function() {
		this.parentElement.classList.remove("error");
	};
	
	document.getElementById("pwd_input").oninvalid = function() {
		this.parentElement.classList.add("error");
	};
	
	document.getElementById("pwd_input").onchange = function() {
		this.parentElement.classList.remove("error");
		if (document.getElementById("pwdc_input").value !== this.value && document.getElementById("pwdc_input").value !== "") {
			this.parentElement.classList.add("error");
		} else {
			document.getElementById("pwdc_input").parentElement.classList.remove("error");
		}
	};
	
	document.getElementById("pwdc_input").oninvalid = function() {
		this.parentElement.classList.add("error");
	};
	
	document.getElementById("pwdc_input").onchange = function() {
		this.parentElement.classList.remove("error");
		if (document.getElementById("pwd_input").value !== this.value) {
			this.parentElement.classList.add("error");
		} else {
			document.getElementById("pwd_input").parentElement.classList.remove("error");
		}
	};
	
	document.getElementById("signup_form").addEventListener("submit", function(e) {
		e.preventDefault();
		var pwd = document.getElementById("pwd_input");
		var pwdc = document.getElementById("pwdc_input");
		var uname = document.getElementById("uname_input");
		var prog = document.getElementById("prog_input");
		if (pwd.value !== pwdc.value) {
			pwd.parentElement.classList.add("error");
			pwdc.parentElement.classList.add("error");
			return;
		}
		
		document.dispatchEvent(new CustomEvent("onSignUpSubmit", {detail: {username: uname.value, password: pwd.value, program: "Computer Science", spec: prog.value}}));
		
	});
	
	view.suSuccess = function () {
		var url = window.location.href.split("/")[0];
		window.location.href = url+"/login";
	};
	
	view.suFail = function(err) {
		
		document.getElementById("login_err").innerHTML = err;
		if (err.indexOf("Username") !== -1) {
			document.getElementById("uname_input").dispatchEvent(new CustomEvent("invalid"));
		}
		if (err.indexOf("Password") !== -1) {
			document.getElementById("pwd_input").dispatchEvent(new CustomEvent("invalid"));
			document.getElementById("pwdc_input").dispatchEvent(new CustomEvent("invalid"));
		}
	};
	
    return view;

}());
