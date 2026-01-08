import { useState } from "react";
import { Sidebar, Menu, MenuItem, menuClasses } from "react-pro-sidebar";
import { NavLink } from "react-router-dom";

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

const Section = ({ title }: { title: string }) => (
  <div
    style={{
      padding: "16px 20px 6px",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.08em",
      color: theme.muted,
      textTransform: "uppercase",
    }}>
    {title}
  </div>
);

export default function DashboardSidebar() {
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);

  const closeOnMobile = () => {
    if (broken) setToggled(false);
  };

  return (
    <>
      {/* Mobile top bar */}
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
          <span style={{ marginLeft: 12, fontWeight: 600 }}>Alpine</span>
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
          height: "100vh",
          maxHeight: "100vh",
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            paddingTop: broken ? "56px" : "0",
          }}>
          {/* Brand */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${theme.border}`,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
            <img src="/logo.png" style={{ width: 32, height: 32 }} />
            <span style={{ fontSize: 18, fontWeight: 600 }}>Alpine</span>
          </div>

          {/* Menu */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            <Menu
              menuItemStyles={{
                root: { fontSize: 14, fontWeight: 500 },
                button: {
                  padding: "12px 16px",
                  margin: "6px 10px",
                  borderRadius: "10px",
                  color: theme.text,
                  "&:hover": {
                    backgroundColor: theme.hover,
                    color: theme.accent,
                  },
                  [`&.${menuClasses.active}`]: {
                    backgroundColor: theme.active,
                    color: theme.accent,
                  },
                },
                subMenuContent: { backgroundColor: theme.panel },
              }}>
              {/* SALES */}
              <Section title="Dashboard" />
              <MenuItem
                component={<NavLink to="/dashboard" />}
                onClick={closeOnMobile}>
                Dashboard
              </MenuItem>
              <Section title="Sales & Orders" />
              <MenuItem
                component={<NavLink to="/orders" />}
                onClick={closeOnMobile}>
                Orders
              </MenuItem>
              <MenuItem
                component={<NavLink to="/invoices" />}
                onClick={closeOnMobile}>
                Invoices
              </MenuItem>
              <MenuItem
                component={<NavLink to="/customers" />}
                onClick={closeOnMobile}>
                Customers
              </MenuItem>

              {/* PRODUCTS */}
              <Section title="Products" />
              <MenuItem
                component={<NavLink to="/products" />}
                onClick={closeOnMobile}>
                Products
              </MenuItem>
              <MenuItem
                component={<NavLink to="/categories" />}
                onClick={closeOnMobile}>
                Categories
              </MenuItem>
              <MenuItem
                component={<NavLink to="/units" />}
                onClick={closeOnMobile}>
                Units
              </MenuItem>

              {/* WEBSITE */}
              <Section title="Website Resources" />
              <MenuItem
                component={<NavLink to="/banners" />}
                onClick={closeOnMobile}>
                Banners
              </MenuItem>
              <MenuItem
                component={<NavLink to="/testimonials" />}
                onClick={closeOnMobile}>
                Testimonials
              </MenuItem>
              <MenuItem
                component={<NavLink to="/videos" />}
                onClick={closeOnMobile}>
                Videos
              </MenuItem>

              {/* OTHER */}
              <Section title="Other" />
              <MenuItem
                component={<NavLink to="/reviews" />}
                onClick={closeOnMobile}>
                Reviews
              </MenuItem>
              <MenuItem
                component={<NavLink to="/contactus" />}
                onClick={closeOnMobile}>
                Contact Us
              </MenuItem>
            </Menu>
          </div>
        </div>
      </Sidebar>
    </>
  );
}
