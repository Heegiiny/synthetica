import React, { Fragment } from "react";

import SynthesisDiscussion from "./SynthesisDiscussion";

function SynthesisDashboard({ model }) {
    const { title, posts } = model;

    return (
        <>
            <div className="col-lg-4">
                <SynthesisDiscussion />
            </div>
            <div className="col-lg-4" />
        </>
    );
}

export default SynthesisDashboard;
