import React, { Component, Fragment } from "react";
import { Button } from "reactstrap";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import SynthesisDashboard from "./SynthesisDashboard";
import ShortGallery from "../gallery/ShortGallery";
import GalleryPage from "../gallery/GalleryPage";
import GalleryPostForm from "../gallery/GalleryPostForm";
import SynthesisCompounds from "./related/SynthesisCompounds";

class SynthesisPage extends Component {
    renderControls = () => {
        if (!this.props.match.isExact) {
            return null;
        }

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

    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.forceUpdate();
        }
    }

    render() {
        const { model } = this.props;
        const { title, posts, products, reagents } = model;
        const routerBasename = this.props.match.url;

        const nestedRouterLocation = {
            pathname: this.props.location.pathname.replace(routerBasename, "")
        };

        return (
            <div className="Synthesis-page mt-3">
                <div className="container-fluid">
                    <div className="row mb-1">
                        <div className="col-lg-6 offset-lg-3">
                            <div className="row">
                                <div className="col-lg-4">
                                    <h1>{title}</h1>
                                </div>
                                <div className="col-lg-8 text-right">
                                    {this.renderControls()}
                                </div>
                                <div className="col-lg-12">
                                    <div className="synthesis-photo">
                                        Synthesis-photo
                                    </div>
                                    <SynthesisCompounds model={model} />
                                    <ShortGallery items={posts} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SynthesisPage;
