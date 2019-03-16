import React from "react";
import { Link } from "react-router-dom";

function ListItem({ link, photo, title, metadata }) {
    photo = photo;
    metadata = metadata ? (
        <div className="list-item-metadata">{metadata}</div>
    ) : null;

    return (
        <div className="list-item col-md-4 col-lg-3 col-6">
            <Link to={link}>
                <div className="list-item-box">
                    <div className="list-item-photo">
                        <img src={photo} alt={title} />
                    </div>
                    <div className="list-item-caption">{title}</div>
                    {metadata}
                </div>
            </Link>
        </div>
    );
}

export default ListItem;
