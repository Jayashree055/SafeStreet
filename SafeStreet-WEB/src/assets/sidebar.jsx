
import React from "react";
import { Link } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { IoMdContact } from "react-icons/io";
import { TbReportSearch } from "react-icons/tb";
import { FaRoad } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";

const Sidebar = ({ openSidebarToggle, toggleSidebar }) => {
  return (
    <>
      {/* Toggle (hamburger) button */}
      <button
        id="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
        style={{
          position: "fixed",
          top: "15px",
          left: "15px",
          zIndex: 1100,
          background: "#00f2fe",
          border: "none",
          padding: "10px",
          color: "#000",
          cursor: "pointer",
          fontSize: "20px",
          borderRadius: "8px",
        }}
      >
        <GiHamburgerMenu />
      </button>

      {/* Sidebar container */}
      <aside
        id="sidebar"
        className={openSidebarToggle ? "sidebar sidebar-responsive" : "sidebar sidebar-hidden"}
      >
        <div className="sidebar-title">
          <div className="sidebar-brand">
            <FaRoad className="icon" />
            <span><strong><i>SAFESTREET</i></strong></span>
          </div>
        </div>

        <ul className="sidebar-list">
          <li className="sidebar-list-item" onClick={toggleSidebar}>
            <Link to="/home">
              <MdSpaceDashboard className="icon" /> <span>Dashboard</span>
            </Link>
          </li>
          <li className="sidebar-list-item" onClick={toggleSidebar}>
            <Link to="/damage_reports">
              <TbReportSearch className="icon" /> <span>Damage Reports</span>
            </Link>
          </li>
          <li className="sidebar-list-item" onClick={toggleSidebar}>
            <Link to="/contact">
              <IoMdContact className="icon" /> <span>Help</span>
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
