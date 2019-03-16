import React, { Fragment } from "react";

import CompoundRelated from "./related/CompoundRelated";
import CompoundTags from "./CompoundTags";
import CompoundProperties from "./CompoundProperties";
import CompoundDiscussion from "./CompoundDiscussion";

function CompoundDashboard({ model }) {
    const { title, text, posts } = model;

    return (
        <>
            <div className="col-lg-4">
                <div className="compound-description">{text}</div>
                <CompoundTags />
                <CompoundProperties />
                <CompoundDiscussion />
            </div>
            <div className="col-lg-4">
                <CompoundRelated model={model} />
            </div>
        </>
    );
}

export default CompoundDashboard;
