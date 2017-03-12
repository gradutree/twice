import React, { Component } from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link,
  IndexRoute
} from 'react-router-dom';

import App from "./app.jsx";
import Dashboard from "./dashboard.jsx";

render(
	<App />,
	document.getElementById("root")
);