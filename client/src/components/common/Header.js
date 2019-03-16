import React, { Component } from "react";
import { Nav, NavItem } from "reactstrap";
import { BrowserRouter as Router, Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import Dropdown, {
    DropdownTrigger,
    DropdownContent
} from "react-simple-dropdown";

function TopMenuLink({ to, children }) {
    return (
        <NavItem>
            <NavLink to={to} className="nav-link" activeClassName={"active"}>
                {children}
            </NavLink>
        </NavItem>
    );
}

function CenterNav({ user }) {
    return (
        <Nav>
            <Dropdown>
                <DropdownTrigger className="nav-link">
                    Compounds
                </DropdownTrigger>
                <DropdownContent className="dropdown-menu">
                    <TopMenuLink to="/compounds">Compounds List</TopMenuLink>
                    <TopMenuLink to="/compounds/new">New Compound</TopMenuLink>
                </DropdownContent>
            </Dropdown>
            <Dropdown>
                <DropdownTrigger className="nav-link">
                    Syntheses
                </DropdownTrigger>
                <DropdownContent className="dropdown-menu">
                    <TopMenuLink to="/syntheses">Syntheses List</TopMenuLink>
                    <TopMenuLink to="/syntheses/new">New Synthesis</TopMenuLink>
                </DropdownContent>
            </Dropdown>
        </Nav>
    );
}

function RightNav({ auth }) {
    if (!auth.isAuthenticated) {
        return (
            <Nav>
                <TopMenuLink to="/login">Sign in</TopMenuLink>
                <TopMenuLink to="/register">Sign up</TopMenuLink>
            </Nav>
        );
    } else {
        return (
            <Nav>
                <TopMenuLink to="/logout">Sign out</TopMenuLink>
                <TopMenuLink to={`/users/${auth.user.id}`}>
                    {auth.user.title}
                </TopMenuLink>
            </Nav>
        );
    }
}

const mapStateToRightNavProps = state => ({
    auth: state.auth
});

RightNav = connect(
    mapStateToRightNavProps,
    {}
)(RightNav);

function Header() {
    return (
        <header className={"app-header"}>
            <nav
                className={
                    "navbar navbar-expand-lg header-navbar navbar-light bg-white"
                }
            >
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">
                        Fuel App
                    </Link>
                    <CenterNav />
                    <RightNav />
                </div>
            </nav>
        </header>
    );
}

export default Header;
