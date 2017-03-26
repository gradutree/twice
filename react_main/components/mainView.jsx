import React, { Component } from 'react';
import { render } from 'react-dom';

class MainView extends Component {
    render() {
        return <div className="flex-row flex-start">
            <div className="main_btn" onClick={() => {
                $('html, body').animate({
                    scrollTop: $("#search_screen").offset().top
                }, 1000);
            }}>Search courses</div>
            <div className="main_btn2" onClick={() => { window.location.href = "/signup"}}>Create a plan</div>
        </div>
    }
}

module.exports = MainView;