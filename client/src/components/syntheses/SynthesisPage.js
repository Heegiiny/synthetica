import React, { Component, Fragment } from "react";
import { Button } from "reactstrap";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { matchPath } from "react-router";
import classNames from "classnames";

import SynthesisDashboard from "./SynthesisDashboard";
import GalleryPage from "../gallery/GalleryPage";
import GalleryPostForm from "../gallery/GalleryPostForm";
import GalleryPostPage from "../gallery/GalleryPostPage";

import connectForm from "../connect/connectForm";
import connectPage from "../connect/connectPage";
import connectList from "../connect/connectList";

class SynthesisPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentSubPath: "",
            routerBasename: ""
        };

        this.updateRouterState(props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.updateRouterState(nextProps);
        }
    }

    updateRouterState = props => {
        const routerBasename = props.match.url;
        let currentSubPath;
        if (props.match.isExact) {
            currentSubPath = "main";
        }

        const isGalleryPage = matchPath(this.props.location.pathname, {
            path: `${routerBasename}/gallery/:id`
        });
        if (isGalleryPage) {
            currentSubPath = "gallery";
        }

        this.setState({
            currentSubPath: currentSubPath,
            routerBasename: routerBasename
        });
    };

    getPageClassName = () =>
        classNames("synthesis-page mt-3", {
            "synthesis-page-with-gallery":
                this.state.currentSubPath === "gallery"
        });

    renderControls = () => {
        /*if (!this.props.match.isExact) {
            return null;
        }*/

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

    renderTitleBar = () => {
        const { currentSubPath, routerBasename } = this.state;
        const { model } = this.props;

        let titleWidth = 12;
        let backBtn = null;
        let controls = null;
        let title = null;

        if (currentSubPath === "main") {
            controls = (
                <div className="col-lg-4 text-right">
                    {this.renderControls()}
                </div>
            );
            titleWidth -= 4;
        }

        if (currentSubPath === "gallery") {
            backBtn = (
                <div className="col-lg-2 pr-0">
                    <Link to={routerBasename}>
                        <Button outline color="info">
                            <i className="fa fa-chevron-left mr-2" /> Back to
                            synthesis
                        </Button>
                    </Link>
                </div>
            );
            titleWidth -= 2;
        }

        const title = (
            <div className={`col-lg-${titleWidth}`}>
                <h1>{model.title}</h1>
            </div>
        );

        return (
            <div className="row title-row">
                {backBtn}
                {title}
                {controls}
            </div>
        );
    };

    render() {
        const { model } = this.props;
        const { routerBasename } = this.state;

        return (
            <div className={this.getPageClassName()}>
                <div className="container">
                    {this.renderTitleBar()}
                    <div className="synthesis-photo">Synthesis-photo</div>
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
                            component={connectList(GalleryPage, "galleryList")}
                        />
                        <Route
                            path={`${routerBasename}/`}
                            render={() => <SynthesisDashboard model={model} />}
                        />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default SynthesisPage;
