import React from "react";
import "../App.css"; // Ensure global styles are applied
import Header from "./header";
import Sidebar from "./sidebar";
import { useLocation } from "react-router-dom";

const MainLayout = ({ children, openSidebarToggle, toggleSidebar, isMobile }) => {
  const location = useLocation();
  const hideLayoutRoutes = ["/", "/login", "/register", "/otp", "/forgotpassword"];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <div className={shouldHideLayout ? "" : "layout-container"}>
      {!shouldHideLayout && (
        <>
          <Header openSidebar={toggleSidebar} />
          <Sidebar
            openSidebarToggle={openSidebarToggle}
            toggleSidebar={toggleSidebar}
          />
        </>
      )}

      <main
        className={`main-content ${shouldHideLayout ? "center-layout" : ""}`}
        style={{
          marginLeft:
            !shouldHideLayout && !isMobile && openSidebarToggle ? "200px" : "0",
          transition: "margin-left 0.3s ease",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
