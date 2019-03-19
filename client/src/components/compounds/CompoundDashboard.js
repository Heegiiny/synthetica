import React, { Fragment } from "react";

import CompoundRelated from "./related/CompoundRelated";
import CompoundTags from "./CompoundTags";
import CompoundProperties from "./CompoundProperties";
import CompoundDiscussion from "./CompoundDiscussion";

function CompoundDashboard({ model }) {
    const { title, text, posts } = model;

    return (
        <div className="row">
            <div className="col-lg-6">
                <div className="compound-description">{text}</div>
                <CompoundTags />
                <CompoundProperties />
                <CompoundDiscussion />
            </div>
            <div className="col-lg-6">
                <CompoundRelated model={model} />
            </div>
        </div>
    );
}

export default CompoundDashboard;
