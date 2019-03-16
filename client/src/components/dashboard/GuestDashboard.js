import React, { Component } from "react";
import { StaticRouter as Router, Route, Switch } from "react-router-dom";
import connectList from "../connect/connectList";
import ShortList from "../list/ShortList";

const CompoundsShortList = connectList(ShortList, "dashboardCompounds", "more");
const SynthesesShortList = connectList(ShortList, "dashboardSyntheses", "more");

class GuestDashboard extends Component {
    render() {
        return (
            <div className="guest-dashboard mt-3">
                <div className="container-fluid">
                    <CompoundsShortList
                        path="compounds"
                        title="Latest added compounds"
                    />
                    <SynthesesShortList
                        path="syntheses"
                        title="Latest added syntheses"
                    />
                </div>
            </div>
        );
    }
}

export default GuestDashboard;
