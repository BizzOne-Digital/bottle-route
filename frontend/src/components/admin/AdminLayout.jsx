import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard, Package, Tag, Settings, LogOut,
  Zap, Menu, X, ExternalLink, ChevronRight
} from 'lucide-react';
import './AdminLayout.css';

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Pricing', href: '/admin/pricing', icon: Tag },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const showLabels = sidebarOpen || mobileOpen;

  return (
    <div className={`admin-layout${sidebarOpen ? '' : ' admin-layout--collapsed'}`}>
      {/* Mobile overlay */}
      {mobileOpen && <div className="admin-mobile-overlay" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar${mobileOpen ? ' admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__header">
          <Link to="/" className="admin-sidebar__logo">
            <div className="admin-sidebar__logo-icon"><Zap size={16} /></div>
            {showLabels && <span>BOTTLE ROUTE</span>}
          </Link>
          <button
            className="admin-sidebar__toggle"
            onClick={() => (mobileOpen ? setMobileOpen(false) : setSidebarOpen(!sidebarOpen))}
          >
            {showLabels ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={`admin-sidebar__link${pathname === href ? ' admin-sidebar__link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} />
              {showLabels && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">
              {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            {showLabels && (
              <div className="admin-sidebar__user-info">
                <p className="admin-sidebar__user-name">{admin?.name}</p>
                <p className="admin-sidebar__user-role">{admin?.role}</p>
              </div>
            )}
          </div>
          <div className="admin-sidebar__actions">
            <a href="/" target="_blank" className="admin-sidebar__action" title="View Site">
              <ExternalLink size={16} />
            </a>
            <button className="admin-sidebar__action admin-sidebar__action--danger" onClick={handleLogout} title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-topbar__menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className="admin-topbar__breadcrumb">
            <span>Admin</span>
            <ChevronRight size={14} />
            <span>{NAV.find(n => n.href === pathname)?.label || 'Panel'}</span>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
