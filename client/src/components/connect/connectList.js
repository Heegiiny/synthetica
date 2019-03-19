import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router";
import InfiniteScroll from "react-infinite-scroller";
import pathHelper from "../../helpers/pathHelper";

import createListActions from "../../actions/generators/createListActions";

export default (
    WrappedComponent,
    stateContainer = "listPage",
    pagination = "scroll"
) => {
    const mapStateToProps = state => {
        const { path, ...stateContainerWithoutPath } = state[stateContainer];
        return stateContainerWithoutPath;
    };
    const mapDispatchToProps = createListActions(stateContainer);

    class ConnectedList extends Component {
        constructor(props) {
            super(props);

            // Get active path either from props or router
            this.path = props.path ? props.path : pathHelper(props.match.path);

            this.props.resetList();

            // Set active path for reducer
            this.props.setActivePath(this.path);

            // Загружаем надписи
            //this.captions = captions[this.path].sidebar;
        }

        componentDidMount() {
            this.props.updateList();
        }

        componentWillUnmount() {
            //this.props.resetList();
        }

        render() {
            const hasMore = this.props.response
                ? this.props.response.page != this.props.response.pages
                : false;

            if (pagination === "scroll") {
                return (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={this.props.loadListPage}
                        hasMore={hasMore}
                        loader={
                            <div className="loader" key={0}>
                                Loading ...
                            </div>
                        }
                    >
                        <WrappedComponent {...this.props} path={this.path} />
                    </InfiniteScroll>
                );
            }

            return <WrappedComponent {...this.props} path={this.path} />;
        }
    }

    return compose(
        withRouter,
        connect(
            mapStateToProps,
            mapDispatchToProps
        )
    )(ConnectedList);
};
