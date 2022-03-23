import React from "react";
import Routes from "./Routes";
import "./Layout.css";
import Navbar from "./Navbar";

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
 function Layout() {
  return (
    <>
      <Navbar />
      <Routes />
    </>
  );
}

export default Layout;
