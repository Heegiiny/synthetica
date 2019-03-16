import React, { Component } from "react";
import Header from "./components/common/Header";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./store";
import ListPage from "./components/list/ListPage";
import NotFound from "./components/common/NotFound";
import connectList from "./components/connect/connectList";
import connectPage from "./components/connect/connectPage";
import connectForm from "./components/connect/connectForm";
import CompoundPage from "./components/compounds/CompoundPage";
import CompoundForm from "./components/compounds/CompoundForm";
import SynthesisForm from "./components/syntheses/SynthesisForm";
import SynthesisPage from "./components/syntheses/SynthesisPage";
import Profile from "./components/profile/Profile";
import Dashboard from "./components/dashboard";
import Login from "./components/auth/Login";

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

const listPagePaths = ["compounds", "syntheses"];

// Check for token
if (localStorage.jwtToken) {
    // Set auth token header auth
    setAuthToken(localStorage.jwtToken);
    // Decode token and get user info and exp
    const decoded = jwt_decode(localStorage.jwtToken);
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));

    // Check for expired token
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        // Logout user
        store.dispatch(logoutUser());
        // TODO: Clear current Profile

        // Redirect to login
        //window.location.href = "/login";
    }
}

class App extends Component {
    render() {
        // Render header everywhere, but on auth pages
        const header = (
            <Switch>
                <Route path="/login" />
                <Route path="/register" />
                <Route path="/password_reset" />
                <Route component={Header} />
            </Switch>
        );

        const listPageRoutes = listPagePaths.map(path => (
            <Route
                key={path}
                path={`/${path}`}
                component={connectList(ListPage)}
            />
        ));

        return (
            <Provider store={store}>
                <Router>
                    <div className="App">
                        {header}

                        <Switch>
                            <Route path="/login" component={Login} />
                            <Route exact path={`/`} component={Dashboard} />
                            <Route
                                path={`/users/:id`}
                                component={connectPage(Profile)}
                            />
                            <Route
                                path={`/compounds/new`}
                                component={connectForm(CompoundForm)}
                            />
                            <Route
                                path={`/compounds/:id/edit`}
                                component={connectForm(CompoundForm)}
                            />
                            <Route
                                path={`/compounds/:id`}
                                component={connectPage(CompoundPage)}
                            />
                            <Route
                                path={`/syntheses/new`}
                                component={connectForm(SynthesisForm)}
                            />
                            <Route
                                path={`/syntheses/:id/edit`}
                                component={connectForm(SynthesisForm)}
                            />
                            <Route
                                path={`/syntheses/:id`}
                                component={connectPage(SynthesisPage)}
                            />
                            {listPageRoutes}
                            <Route component={NotFound} />
                        </Switch>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
