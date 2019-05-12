import React, { Component, createRef } from "react";
import { Link } from "react-router-dom";
import textFit from "textfit";

const TEXTFIT_SETTINGS = {
    widthOnly: true,
    minFontSize: 18,
    maxFontSize: 50
};

class CompoundListItem extends Component {
    constructor(props) {
        super(props);
        this.formulaTextRef = createRef();
    }

    parseFormulaDigits = formula => formula.replace(/(\d+)/g, "<sub>$1</sub>");

    renderPhoto = () => {
        const { formula, title } = this.props.model;

        if (formula && formula.isImage && formula.text && formula.text.length) {
            return <img src={`/media/${formula.text}`} alt={title} />;
        } else if (formula && formula.text && formula.text.length) {
            return (
                <div
                    className="compound-formula-text"
                    ref={this.formulaTextRef}
                >
                    <span
                        dangerouslySetInnerHTML={{
                            __html: this.parseFormulaDigits(formula.text)
                        }}
                    />
                </div>
            );
        } else {
            return null;
        }
    };

    componentDidMount() {
        if (this.formulaTextRef.current)
            textFit(this.formulaTextRef.current, TEXTFIT_SETTINGS);
    }

    render() {
        const title = this.props.model.title;
        const metadata = this.props.metadata ? (
            <div className="list-item-metadata">{this.props.metadata}</div>
        ) : null;

        return (
            <div className="list-item col-md-4 col-lg-3 col-6">
                <Link to={this.props.link}>
                    <div className="list-item-box">
                        <div className="list-item-photo">
                            {this.renderPhoto()}
                        </div>
                        <div className="list-item-caption">{title}</div>
                        {metadata}
                    </div>
                </Link>
            </div>
        );
    }
}

export default CompoundListItem;
