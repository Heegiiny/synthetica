import React from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

function CreateBtn({ match, location }) {
    const createPath = "/gallery/new";
    const baseUrl = match.url;

    if (location.pathname.replace(baseUrl, "") === createPath) {
        return null;
    }

    return (
        <Link to={match.url + createPath}>
            <Button color="success" outline size="sm">
                <i className="fa fa-plus" /> New media
            </Button>
        </Link>
    );
}
CreateBtn = withRouter(CreateBtn);

function ShortGallery({ items, match }) {
    const renderItem = item => (
        <div className="col" key={item._id}>
            <Link to="/">
                <img src={item.preview} alt={item.title} />
            </Link>
        </div>
    );

    return (
        <div className="short-gallery mt-3">
            <div className="row mb-1">
                <div className="col-6">
                    <div className="h3 gallery-title">Gallery</div>
                </div>
                <div className="col-6 text-right">
                    <CreateBtn />
                </div>
            </div>

            <div className="row flex-nowrap">
                {items && items.map(renderItem)}
            </div>
        </div>
    );
}

export default withRouter(ShortGallery);
