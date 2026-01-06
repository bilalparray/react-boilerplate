import { useState } from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  menuClasses,
} from "react-pro-sidebar";

const theme = {
  bg: "#020617",
  panel: "#020617",
  hover: "#1e293b",
  active: "#0f172a",
  text: "#e5e7eb",
  muted: "#94a3b8",
  accent: "#38bdf8",
  border: "#1e293b",
};

export default function DashboardSidebar() {
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);

  return (
    <>
      {/* Mobile fixed top bar */}
      {broken && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "56px",
            zIndex: 1200,
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            borderBottom: "1px solid #e5e7eb",
          }}>
          <button
            className="btn btn-outline-dark"
            onClick={() => setToggled((t) => !t)}>
            ☰
          </button>
          <span style={{ marginLeft: "12px", fontWeight: 600 }}>Alpine</span>
        </div>
      )}

      <Sidebar
        breakPoint="md"
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        backgroundColor={theme.bg}
        rootStyles={{
          color: theme.text,
          borderRight: `1px solid ${theme.border}`,
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            paddingTop: broken ? "56px" : "0",
          }}>
          {/* Logo + Brand */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${theme.border}`,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}>
            <img
              src="/logo.png"
              alt="Alpine"
              style={{ width: 32, height: 32 }}
            />
            <span style={{ fontSize: 18, fontWeight: 600 }}>Alpine</span>
          </div>

          {/* Menu */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            <Menu
              menuItemStyles={{
                root: {
                  fontSize: "14px",
                  fontWeight: 500,
                },

                button: {
                  padding: "12px 16px",
                  margin: "6px 10px",
                  borderRadius: "10px",
                  color: theme.text,
                  backgroundColor: "transparent",

                  "&:hover": {
                    backgroundColor: theme.hover,
                    color: theme.accent,
                  },

                  [`&.${menuClasses.active}`]: {
                    backgroundColor: theme.active,
                    color: theme.accent,
                  },
                },

                label: {
                  color: theme.text,
                },

                subMenuContent: {
                  backgroundColor: theme.panel,
                },
              }}>
              <SubMenu label="Charts">
                <MenuItem>Pie Charts</MenuItem>
                <MenuItem>Line Charts</MenuItem>
              </SubMenu>

              <MenuItem>Documentation</MenuItem>
              <MenuItem>Calendar</MenuItem>
            </Menu>
          </div>
        </div>
      </Sidebar>
    </>
  );
}
