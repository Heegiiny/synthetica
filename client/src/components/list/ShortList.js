import React, { Component } from "react";
import { Button } from "reactstrap";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Scrollbar from "react-perfect-scrollbar";
import ListItem from "./ListItem";
import classNames from "classnames";
import CompoundListItem from "../compounds/CompoundListItem";

class ShortList extends Component {
    getPath = () => this.props.path.replace(/^\/|\/$/g, "");

    renderListItem = item => {
        const path = this.getPath();
        const link = `/${path}/${item.id}`;

        if (path === "compounds") {
            return <CompoundListItem link={link} model={item} key={item._id} />;
        }

        return (
            <ListItem
                link={link}
                photo={item.preview}
                title={item.title}
                key={item._id}
            />
        );
    };

    renderMoreBtn = () => {
        return this.props.more ? (
            <div className="text-right mt-1">
                <Link to={this.getPath()}>
                    <Button size="sm" outline color="secondary">
                        More
                        <i className="fa fa-angle-double-right ml-2 mr-0" />
                    </Button>
                </Link>
            </div>
        ) : null;
    };

    renderNewBtn = () => {
        return this.props.newBtn ? (
            <div className="text-right mt-1">
                <Link to={this.getPath() + "/new"}>
                    <Button size="sm" outline color="success">
                        <i className="fa fa-plus" />
                        Create new
                    </Button>
                </Link>
            </div>
        ) : null;
    };

    renderHeadline = () => {
        const { title, moreBtn } = this.props;
        return (
            <div className="short-list-title-row">
                <div className="short-list-title">{title}</div>
                {moreBtn && this.renderMoreBtn()}
            </div>
        );
    };

    getRowClassName = () =>
        classNames("row", {
            "flex-column": this.props.vertical
        });

    render() {
        const { items } = this.props;

        if (!items || !items.length) {
            return null;
        }

        const scrollbarOptions = {
            wheelSpeed: 3,
            suppressScrollY: true,
            useBothWheelAxes: true
        };

        return (
            <div className="short-list">
                {this.renderHeadline()}
                <Scrollbar option={scrollbarOptions}>
                    <div className={this.getRowClassName()}>
                        {items.map(this.renderListItem)}
                    </div>
                </Scrollbar>
                {this.renderMoreBtn()}
            </div>
        );
    }
}

export default ShortList;
