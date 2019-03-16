import React, { Component } from "react";
import ShortList from "../list/ShortList";

class Profile extends Component {
    render() {
        const { title, compoundPosts, synthesisPosts } = this.props.model;

        return (
            <div className="user-profile mt-3">
                <div className="container-fluid">
                    <h1>{title}</h1>

                    <ShortList
                        title={`Compound posts by ${title}`}
                        items={compoundPosts}
                    />
                    <ShortList
                        title={`Syntheses posts by ${title}`}
                        items={synthesisPosts}
                    />
                </div>
            </div>
        );
    }
}
export default Profile;
