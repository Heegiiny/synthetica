import React, { Component } from "react";
import ListItem from "./ListItem";
import CompoundListItem from "../compounds/CompoundListItem";

class ListPage extends Component {
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
        const { items } = this.props;
        return (
            <div className="list-page container mt-3">
                <div className="row">{items.map(this.renderListItem)}</div>
            </div>
        );
    }
}

export default ListPage;
