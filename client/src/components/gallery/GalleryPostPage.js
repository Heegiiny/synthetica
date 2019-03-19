import React, { Component, Fragment } from "react";
import ReactPlayer from "react-player";
import SynthesisGalleryMetadata from "../syntheses/SynthesisGalleryMetadata";

class GalleryPostPage extends Component {
    renderBlocks = block => {
        const { _id, image, video, text } = block;

        return (
            <div className="gallery-post-page-block" key={_id}>
                {video && (
                    <div className="gallery-post-video">
                        <ReactPlayer url={video} controls />
                    </div>
                )}
                {image && <img src={`/media/${image}`} alt="" />}
                <p>{text}</p>
            </div>
        );
    };

    render() {
        const { model } = this.props;
        const { title, blocks } = model;

        return (
            <>
                <div className="gallery-post-page">
                    <h2>{title}</h2>
                    {blocks && blocks.map && blocks.map(this.renderBlocks)}
                </div>
                {model.synthesis && <SynthesisGalleryMetadata model={model} />}
            </>
        );
    }
}

export default GalleryPostPage;
