import React, { Component } from "react";
import ListPage from "../list/ListPage";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

class GalleryPage extends Component {
    render() {
        return (
            <div className="gallery-page">
                <div className="gallery-page-list">
                    <ListPage {...this.props} />
                </div>
            </div>
        );
    }
}

export default GalleryPage;
