import React, { Component } from "react";
import ShortList from "../list/ShortList";
import SuggestionsField from "./SuggestionsField";

class RelatedField extends Component {
    /*addNewRelated = newRelated => {
        const { name, model, subPath } = this.props;
        const related = model[name];
        const newRelated = new Array(...related);

        const newRelatedIndex = related.length;

        newRelated.splice(newRelatedIndex, 0, {
            [subPath]: newRelated
        });

        this.props.updateStateModel(name, newRelated);

        return newRelatedIndex;
    };*/

    onSuggestionSelected = (e, { suggestion }) => {
        const { name, model, subPath } = this.props;
        const related = model[name];
        const newRelated = new Array(...related);

        const newRelatedIndex = related.length;

        newRelated.splice(newRelatedIndex, 0, {
            [subPath]: suggestion
        });

        this.props.updateStateModel(name, newRelated);
    };

    render() {
        const { label, name, path, model, subPath } = this.props;
        let items = model[name];

        if (items && items.map && subPath) {
            items = items.map(item => item[subPath]);
        }

        return (
            <div className="related-field">
                <ShortList vertical title={label} items={items} />

                <SuggestionsField
                    label={label}
                    name={name}
                    path={path}
                    onSuggestionSelected={this.onSuggestionSelected}
                />
            </div>
        );
    }
}

export default RelatedField;
