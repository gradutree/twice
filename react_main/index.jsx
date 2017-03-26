import React, { Component } from 'react';
import { render } from 'react-dom';

import MainView from "./components/mainView.jsx";
import SearchView from "./components/searchView.jsx";
import Actions from "./flux/actions.jsx";

render(
    <MainView />,
    document.getElementById("btn_root")
);

render(
    <SearchView/>,
    document.getElementById("search_screen")
);

var getCurrentUsername = function () {
    var keyValuePairs = document.cookie.split('; ');
    for(var i in keyValuePairs){
        var keyValue = keyValuePairs[i].split('=');
        if(keyValue[0]=== 'username') return keyValue[1];
    }
    return null;
};


if (!getCurrentUsername()) document.getElementById("btn_list").innerHTML = `<li><a href="login/">Login</a></li> <li><a href="signup/">Sign up</a></li><li><a href="#about">About</a></li>`;
else  document.getElementById("btn_list").innerHTML = `<li><a href="/dashboard">Dashboard</a></li> <li class="profile"> <div class="btn-group"> <button id="profile" type="button"
 class="profile_btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
  <img style="background-color: #fff;" id="profile_img" src="/media/user.png"> </button> <ul id="menu" class="dropdown-menu"
   style="left: -60px; z-index: 5; position:absolute; top: 125%"> <li style="margin: 10px 0; width: 100%;"><a href="/api/signout">Sign out</a></li>
    </ul> <div id="popover-arrow" class="popover-arrow hidden" style="margin-left:10px; z-index: 10; position: absolute; top: 35px;"></div>
     </div></li>`;

document.getElementById("profile").addEventListener("click", function(e) {
    var popover = document.getElementById("popover-arrow");
    if (popover.classList.contains("hidden")) {
        popover.classList.remove("hidden");
    }
    else {
        popover.classList.add("hidden");
    }
});

document.addEventListener("click", function(e) {
    var popover = document.getElementById("popover-arrow");
    var menu = document.getElementById("menu");
    if ((!menu.contains(e.target) && !document.getElementById("profile").contains(e.target)) || e.target == menu) {
        popover.classList.add("hidden");
    }
});

if (window.location.href.toLowerCase().indexOf("search") != -1) {
    $('html, body').animate({
        scrollTop: $("#search_screen").offset().top
    }, 1000);
}