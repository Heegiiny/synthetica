import React, { Fragment } from "react";

import SynthesisDiscussion from "./SynthesisDiscussion";
import ShortGallery from "../gallery/ShortGallery";
import SynthesisCompounds from "./related/SynthesisCompounds";

function SynthesisDashboard({ model }) {
    return (
        <>
            <SynthesisCompounds model={model} />
            <ShortGallery items={model.gallery} />
        </>
    );
}

export default SynthesisDashboard;
