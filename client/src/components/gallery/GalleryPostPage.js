import React, { Component, Fragment } from "react";
import { Button } from "reactstrap";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import ReactPlayer from "react-player";
import SynthesisGalleryMetadata from "../syntheses/gallery/SynthesisGalleryMetadata";
import PageHeadline from "../common/PageHeadline";

class GalleryPostPage extends Component {
    renderControls = () => {
        const editBtn = (
            <Link to={this.props.match.url + "/edit"}>
                <Button size="sm" outline color="secondary" className="ml-2">
                    <i className="fa fa-edit" />
                    Edit
                </Button>
            </Link>
        );

        const removeBtn = (
            <Button size="sm" outline color="danger" className="ml-2">
                <i className="fa fa-trash-alt" />
                Delete
            </Button>
        );

        return (
            <>
                {editBtn}
                {removeBtn}
            </>
        );
    };

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
                    <PageHeadline
                        className="gallery-post-page-title"
                        titleEl="h3"
                        {...this.props}
                        {...this.state}
                    />
                    {blocks && blocks.map && blocks.map(this.renderBlocks)}
                </div>
                {model.synthesis && <SynthesisGalleryMetadata model={model} />}
            </>
        );
    }
}

export default GalleryPostPage;
