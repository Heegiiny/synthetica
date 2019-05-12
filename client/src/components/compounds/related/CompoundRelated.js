import React from "react";
import ShortList from "../../list/ShortList";
import { BrowserRouter as Router } from "react-router-dom";

function CompoundRelated({ model }) {
    const { relatedPosts, syntheses, synthesesWith } = model;
    return (
        <div className="compound-related">
            <ShortList
                path="compounds"
                title="Gallery posts mention the compound"
                items={relatedPosts}
            />
            <ShortList
                path="syntheses"
                title="Syntheses of the compound"
                items={syntheses}
            />
            <ShortList
                path="syntheses"
                title="Syntheses from the compound"
                items={synthesesWith}
            />
        </div>
    );
}

export default CompoundRelated;
