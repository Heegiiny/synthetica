import React, { Component, createElement } from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import PropTypes from "prop-types";
import ModelControls from "./ModelControls";
import classNames from "classnames";

class PageHeadline extends Component {
    static defaultProps = {
        backText: "Back to main page",
        titleEl: "h1"
    };
    static propTypes = {
        model: PropTypes.object.isRequired,
        routerBasename: PropTypes.string.isRequired,
        currentSubPath: PropTypes.string.isRequired,
        backText: PropTypes.string,
        className: PropTypes.string,
        titleEl: PropTypes.string
    };

    renderBackBtn = () => {
        const { backText, routerBasename } = this.props;
        return (
            <div className="col-lg-2 pr-0 title-row-back">
                <Link to={routerBasename}>
                    <Button outline color="info">
                        <i className="fa fa-chevron-left mr-2" /> {backText}
                    </Button>
                </Link>
            </div>
        );
    };

    renderControls = () => {
        return (
            <div className="col-lg-4 text-right title-row-controls">
                <ModelControls {...this.props} />
            </div>
        );
    };

    renderTitle = titleWidth => {
        const { model, titleEl } = this.props;
        const title = createElement(titleEl, {}, model.title);

        return <div className={`col-lg-${titleWidth}`}>{title}</div>;
    };

    getRowClassName = () => classNames("row title-row", this.props.className);

    render() {
        const { currentSubPath } = this.props;

        let titleWidth = 12;
        let backBtn,
            controls = null;

        if (currentSubPath === "main" || !currentSubPath) {
            controls = this.renderControls();
            titleWidth -= 4;
        } else {
            backBtn = this.renderBackBtn();
            titleWidth -= 2;
        }

        return (
            <div className={this.getRowClassName()}>
                {backBtn}
                {this.renderTitle(titleWidth)}
                {controls}
            </div>
        );
    }
}

export default PageHeadline;
