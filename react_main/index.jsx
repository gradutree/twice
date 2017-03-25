import React, { Component } from 'react';
import { render } from 'react-dom';

import MainView from "./components/mainView.jsx";
import SearchView from "./components/searchView.jsx";

render(
    <MainView />,
    document.getElementById("btn_root")
);

render(
    <SearchView/>,
    document.getElementById("search_screen")
);