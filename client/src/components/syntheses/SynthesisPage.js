import React, { Component, Fragment } from "react";
import { Button } from "reactstrap";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { matchPath } from "react-router";
import classNames from "classnames";

import GalleryPage from "../gallery/GalleryPage";
import GalleryPostForm from "../gallery/GalleryPostForm";
import GalleryPostPage from "../gallery/GalleryPostPage";

import connectForm from "../connect/connectForm";
import connectPage from "../connect/connectPage";
import connectList from "../connect/connectList";
import SynthesisCompounds from "./related/SynthesisCompounds";
import ShortList from "../list/ShortList";
import PageHeadline from "../common/PageHeadline";

class SynthesisPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentSubPath: "",
            routerBasename: ""
        };
    }

    componentDidMount() {
        this.updateRouterState(this.props);
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

        const isGalleryPage = matchPath(props.location.pathname, {
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

    render() {
        const { model } = this.props;
        const { routerBasename } = this.state;

        return (
            <div className={this.getPageClassName()}>
                <div className="container">
                    <PageHeadline
                        backText="Back to synthesis"
                        {...this.props}
                        {...this.state}
                    />
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
                        <Route path={`${routerBasename}/`}>
                            <>
                                <SynthesisCompounds model={model} />
                                <ShortList
                                    items={model.gallery}
                                    path={`${routerBasename}/gallery`}
                                    newBtn
                                />
                            </>
                        </Route>
                    </Switch>
                </div>
            </div>
        );
    }
}

export default SynthesisPage;
