import React, { useState } from "react";
import { NavLink as RouterLink, Route, useLocation } from "react-router-dom";
import {
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  UncontrolledDropdown,
} from "reactstrap";
import { useLoginState } from "../api/InternalAPIClient";
import { useLoginLink } from "../utils/Url";
import { ACCOUNT_INFO } from "../utils/RouterPath";
import * as UserState from "../utils/UserState";
import { ThemeSelector } from "./ThemeSelector";
import { UserSearchBar } from "./UserSearchBar";

export const NavigationBar = () => {
  const loginState = useLoginState().data;
  const isLoggedIn = UserState.isLoggedIn(loginState);
  const loggedInUserId = UserState.loggedInUserId(loginState) ?? "";
  const loginLink = useLoginLink();
  const location = useLocation();

  const [isOpen, setIsOpen] = React.useState(false);

  const [isNavigationFixed, setIsNavigationFixed] = useState(true);
  const closeNavbar = () => setIsOpen(false);

  React.useEffect(() => {
    closeNavbar();
  }, [location.pathname]);

  return (
    <div className={isNavigationFixed ? "sticky-top" : ""}>
      <Navbar color="dark" dark expand="lg">
        <NavbarBrand tag={RouterLink} to="/" className="mb-0 h1">
          AtCoder Problems
        </NavbarBrand>

        <NavbarToggler onClick={(): void => setIsOpen(!isOpen)} />

        <Collapse isOpen={isOpen} navbar>
          <Nav navbar>
            <NavItem>
              <NavLink tag={RouterLink} to="/table/" onClick={closeNavbar}>
                Problems
              </NavLink>
            </NavItem>

            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Rankings
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem tag={RouterLink} to="/ac" onClick={closeNavbar}>
                  AC Count
                </DropdownItem>
                <DropdownItem tag={RouterLink} to="/fast" onClick={closeNavbar}>
                  Fastest Submissions
                </DropdownItem>
                <DropdownItem
                  tag={RouterLink}
                  to="/short"
                  onClick={closeNavbar}
                >
                  Shortest Submissions
                </DropdownItem>
                <DropdownItem
                  tag={RouterLink}
                  to="/first"
                  onClick={closeNavbar}
                >
                  First AC
                </DropdownItem>
                <DropdownItem tag={RouterLink} to="/sum" onClick={closeNavbar}>
                  Rated Point Ranking
                </DropdownItem>
                <DropdownItem
                  tag={RouterLink}
                  to="/streak"
                  onClick={closeNavbar}
                >
                  Streak Ranking
                </DropdownItem>
                <DropdownItem tag={RouterLink} to="/lang" onClick={closeNavbar}>
                  Language Owners
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <NavItem>
              <NavLink
                tag={RouterLink}
                to="/submissions/recent"
                onClick={closeNavbar}
              >
                Submissions
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href="https://github.com/kenkoooo/AtCoderProblems/tree/master/doc"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeNavbar}
              >
                FAQ
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href="https://kenkoooo.com/atcoder/book/index.html"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeNavbar}
              >
                User Guide
              </NavLink>
            </NavItem>

            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Links
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  tag="a"
                  href="https://atcoder.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeNavbar}
                >
                  AtCoder
                </DropdownItem>
                <DropdownItem
                  tag="a"
                  href="http://aoj-icpc.ichyo.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeNavbar}
                >
                  AOJ-ICPC
                </DropdownItem>
                <DropdownItem
                  tag="a"
                  href="https://github.com/kenkoooo/AtCoderProblems"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeNavbar}
                >
                  GitHub
                </DropdownItem>
                <DropdownItem
                  tag="a"
                  href="https://twitter.com/kenkoooo"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeNavbar}
                >
                  @kenkoooo
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <NavItem>
              <NavLink
                href="https://github.com/sponsors/kenkoooo"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeNavbar}
              >
                Send a tip
              </NavLink>
            </NavItem>
          </Nav>

          <Nav className="ml-auto" navbar>
            <ThemeSelector />

            <NavItem>
              <NavLink
                tag={RouterLink}
                to="/contest/recent"
                onClick={closeNavbar}
              >
                Virtual Contests
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink tag={RouterLink} to="/training" onClick={closeNavbar}>
                Training
              </NavLink>
            </NavItem>

            <NavItem>
              {isLoggedIn ? (
                <NavLink
                  tag={RouterLink}
                  to={ACCOUNT_INFO}
                  onClick={closeNavbar}
                >
                  Account ({loggedInUserId})
                </NavLink>
              ) : (
                <NavLink href={loginLink} onClick={closeNavbar}>
                  Login
                </NavLink>
              )}
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>

      <Route
        path={[
          "/user/:userIds([a-zA-Z0-9_]+)+",
          "/table/:userIds([a-zA-Z0-9_]*)*",
          "/list/:userIds([a-zA-Z0-9_]*)*",
        ]}
      >
        <UserSearchBar
          isNavigationFixed={isNavigationFixed}
          setIsNavigationFixed={() => setIsNavigationFixed((e) => !e)}
        />
      </Route>
    </div>
  );
};
