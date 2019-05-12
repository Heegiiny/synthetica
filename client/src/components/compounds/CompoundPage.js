import React, { Component, Fragment } from "react";
import { Button } from "reactstrap";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { matchPath } from "react-router";

import CompoundDashboard from "./CompoundDashboard";

import GalleryPage from "../gallery/GalleryPage";
import GalleryPostForm from "../gallery/GalleryPostForm";
import GalleryPostPage from "../gallery/GalleryPostPage";

import connectForm from "../connect/connectForm";
import connectPage from "../connect/connectPage";
import connectList from "../connect/connectList";
import ShortList from "../list/ShortList";
import PageHeadline from "../common/PageHeadline";

class CompoundPage extends Component {
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
        console.log(nextProps);
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.updateRouterState(nextProps);
        }
    }

    updateRouterState = props => {
        const routerBasename = props.match.url;
        let currentSubPath = "";
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

    render() {
        const { title, gallery } = this.props.model;
        const routerBasename = this.props.match.url;

        const nestedRouterLocation = {
            pathname: this.props.location.pathname.replace(routerBasename, "")
        };

        return (
            <div className="compound-page mt-3">
                <div className="container">
                    <PageHeadline
                        backText="Back to compound"
                        {...this.props}
                        {...this.state}
                    />
                    {/*<div className="row">
                        <div className="col-lg-4">*/}
                    <div className="compound-photo">compound-photo</div>
                    <ShortList
                        items={gallery}
                        path={`${routerBasename}/gallery`}
                        newBtn
                    />
                    {/*</div>
                        <div className="col-lg-8">*/}
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
                            render={() => (
                                <CompoundDashboard model={this.props.model} />
                            )}
                        />
                    </Switch>
                    {/*</div>
                    </div>*/}
                </div>
            </div>
        );
    }
}

export default CompoundPage;
