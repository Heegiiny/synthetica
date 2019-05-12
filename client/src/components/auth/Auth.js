/** Base for auth pages, where a form placed in the middle of the screen */

import React from "react";
import ErrorAlert from "../common/ErrorAlert";
import { Alert } from "reactstrap";

function Auth({ children, errors, message }) {
    return (
        <div className="login">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 m-auto">
                        <h1 className="display-4 text-center">Synthetica</h1>
                        {errors && <ErrorAlert errors={errors} />}
                        {message && <Alert color="success">{message}</Alert>}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export const authRoutes = {};

export default Auth;
