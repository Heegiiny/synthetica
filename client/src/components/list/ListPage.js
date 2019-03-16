import React, { Component } from "react";
import ListItem from "./ListItem";

class ListPage extends Component {
    renderListItem = item => {
        const link = `/${this.props.path}/${item.id}`;

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
