import React, { Component } from "react";
import ListItem from "./ListItem";
import classNames from "classnames";
import CompoundListItem from "../compounds/CompoundListItem";

class ShortList extends Component {
    renderListItem = item => {
        const { path } = this.props;
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

    render() {
        const { items, title, vertical } = this.props;

        if (!items || !items.length) {
            return null;
        }

        const rowClassName = classNames("row", {
            "flex-column": vertical
        });

        return (
            <div className="short-list">
                <div className="short-list-title">{title}</div>
                <div className={rowClassName}>
                    {items.map(this.renderListItem)}
                </div>
            </div>
        );
    }
}

export default ShortList;
