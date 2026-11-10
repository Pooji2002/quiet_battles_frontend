
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  BookOpen,
  Package,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

import "../styles/Admin.css";
import AdminSeries from "./AdminSeries";
import AdminChapters from "./AdminChapters";
import AdminProducts from "./AdminProducts";

function Admin() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("qbUser") || "{}");

  const navigation = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Series", icon: Layers },
    { name: "Chapters", icon: BookOpen },
    { name: "Products", icon: Package },
  ];

  const handleLogout = () => {
    localStorage.removeItem("qbAccessToken");
    localStorage.removeItem("qbUser");
    navigate("/admin/login", { replace: true });
  };

  const handleNavigation = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">

      {/* Mobile menu button */}
      <button
        className="admin-mobile-menu"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>

        <div className="admin-sidebar-brand">
          <h2>QUIET BATTLES<span>™</span></h2>
          <p>CONTENT MANAGEMENT</p>
        </div>

        <div className="admin-sidebar-label">WORKSPACE</div>

        <nav className="admin-navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={
                  activeSection === item.name
                    ? "admin-nav-item active"
                    : "admin-nav-item"
                }
                onClick={() => handleNavigation(item.name)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-user">
            <div className="admin-user-avatar">
              {(user.fullName || "A").charAt(0).toUpperCase()}
            </div>

            <div className="admin-user-details">
              <strong>{user.fullName || "Administrator"}</strong>
              <span>{user.role || "ADMIN"}</span>
            </div>
          </div>

          <button className="admin-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">

        <header className="admin-topbar">
          <div>
            <p className="admin-breadcrumb">
              QUIET BATTLES / {activeSection.toUpperCase()}
            </p>
            <h1>{activeSection}</h1>
          </div>

          <button
            className="admin-view-site"
            onClick={() => navigate("/")}
          >
            View Website
            <ExternalLink size={16} />
          </button>
        </header>

       
{activeSection === "Overview" ? (
  <section className="admin-overview">

    <div className="admin-welcome">
      <div>
        <span className="admin-eyebrow">
          <ShieldCheck size={15} />
          ADMINISTRATOR ACCESS
        </span>

        <h2>Welcome back, {user.fullName || "Admin"}.</h2>

        <p>
          Manage your stories, collections and products
          from one place.
        </p>
      </div>

      <div className="admin-welcome-mark">QB™</div>
    </div>

    <div className="admin-section-heading">
      <div>
        <span>YOUR WORKSPACE</span>
        <h2>Content Overview</h2>
      </div>
      <p>QUIET BATTLES™ CMS</p>
    </div>

    <div className="admin-stat-grid">
      <div className="admin-stat-card">
        <div className="admin-stat-icon"><Layers /></div>
        <span>COLLECTIONS</span>
        <h3>—</h3>
        <p>Series management</p>
      </div>

      <div className="admin-stat-card">
        <div className="admin-stat-icon"><BookOpen /></div>
        <span>STORIES</span>
        <h3>—</h3>
        <p>Chapter management</p>
      </div>

      <div className="admin-stat-card">
        <div className="admin-stat-icon"><Package /></div>
        <span>PRODUCTS</span>
        <h3>—</h3>
        <p>Product catalogue</p>
      </div>
    </div>

    <div className="admin-section-heading quick-heading">
      <div>
        <span>MANAGE YOUR BRAND</span>
        <h2>Quick Access</h2>
      </div>
    </div>

    <div className="admin-quick-grid">
      {navigation.slice(1).map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.name}
            className="admin-quick-card"
            onClick={() => handleNavigation(item.name)}
          >
            <Icon size={23} />
            <span>{item.name}</span>
            <ArrowUpRight size={18} />
          </button>
        );
      })}
    </div>

    <div className="admin-footer-note">
      <span>QUIET BATTLES™</span>
      <p>WEAR YOUR BATTLES.</p>
    </div>

  </section>

) : activeSection === "Series" ? (

  <AdminSeries />

) : activeSection === "Chapters" ? (

  <AdminChapters />

) : activeSection === "Products" ? (

  <AdminProducts />

) : null}

      </main>
    </div>
  );
}

export default Admin;
