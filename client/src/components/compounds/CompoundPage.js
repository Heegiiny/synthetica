import React, { Component, Fragment } from "react";
import { Button } from "reactstrap";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import CompoundDashboard from "./CompoundDashboard";

import ShortGallery from "../gallery/ShortGallery";
import GalleryPage from "../gallery/GalleryPage";
import GalleryPostForm from "../gallery/GalleryPostForm";
import GalleryPostPage from "../gallery/GalleryPostPage";

import connectForm from "../connect/connectForm";
import connectPage from "../connect/connectPage";
import connectList from "../connect/connectList";

class CompoundPage extends Component {
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
    /*
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            return true;
        }
    }*/

    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.forceUpdate();
        }
    }

    render() {
        const { title, gallery } = this.props.model;
        const routerBasename = this.props.match.url;

        const nestedRouterLocation = {
            pathname: this.props.location.pathname.replace(routerBasename, "")
        };

        return (
            <div className="compound-page mt-3">
                <div className="container-fluid">
                    <div className="row mb-1">
                        <div className="col-lg-4">
                            <h1>{title}</h1>
                        </div>
                        <div className="col-lg-8 text-right">
                            {this.renderControls()}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="compound-photo">compound-photo</div>
                            <ShortGallery items={gallery} />
                        </div>
                        <div className="col-lg-8">
                            <Switch>
                                <Route
                                    path={`${routerBasename}/gallery/new`}
                                    component={connectForm(
                                        GalleryPostForm,
                                        "galleryPost"
                                    )}
                                />
                                <Route
                                    path={`${routerBasename}/gallery/:id`}
                                    component={connectPage(
                                        GalleryPostPage,
                                        "galleryPost"
                                    )}
                                />
                                <Route
                                    path={`${routerBasename}/gallery`}
                                    component={connectList(
                                        GalleryPage,
                                        "galleryList"
                                    )}
                                />
                                <Route
                                    path={`${routerBasename}/`}
                                    render={() => (
                                        <CompoundDashboard
                                            model={this.props.model}
                                        />
                                    )}
                                />
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CompoundPage;
