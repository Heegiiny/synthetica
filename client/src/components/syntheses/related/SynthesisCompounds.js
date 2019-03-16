import React from "react";
import ShortList from "../../list/ShortList";

function SynthesisCompounds({ model }) {
    const { reagents, products } = model;
    const mapToCompound = item => item.compound;
    return (
        <div className="row">
            <div className="col-sm-6">
                <div className="synthesis-reagents">
                    <ShortList
                        vertical
                        title="Reagents"
                        path="compounds"
                        items={reagents && reagents.map(mapToCompound)}
                    />
                </div>
            </div>
            <div className="col-sm-6">
                <div className="synthesis-products">
                    <ShortList
                        vertical
                        title="Products"
                        path="compounds"
                        items={products && products.map(mapToCompound)}
                    />
                </div>
            </div>
        </div>
    );
}

export default SynthesisCompounds;
