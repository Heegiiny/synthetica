import React, { Component } from "react";

class SynthesisGalleryMetadata extends Component {
    render() {
        const { model } = this.props;
        return (
            <div className="synthesis-gallery-metadata">
                <div className="row">
                    <div className="col-lg-4">{/*model.user.title*/}</div>
                    <div className="col-lg-4">{/*model.user.title*/}</div>
                    <div className="col-lg-4">{/*model.user.title*/}</div>
                </div>
            </div>
        );
    }
}

export default SynthesisGalleryMetadata;
