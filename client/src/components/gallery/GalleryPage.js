import React, { Component } from "react";
import ListPage from "../list/ListPage";

class GalleryPage extends Component {
    render() {
        return (
            <div className="gallery-page">
                <ListPage items={this.props.items} />
            </div>
        );
    }
}

export default GalleryPage;
