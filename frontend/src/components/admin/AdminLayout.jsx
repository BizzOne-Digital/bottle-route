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

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className={`admin-layout${sidebarOpen ? '' : ' admin-layout--collapsed'}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <Link to="/" className="admin-sidebar__logo">
            <div className="admin-sidebar__logo-icon"><Zap size={16} /></div>
            {sidebarOpen && <span>BOTTLE ROUTE</span>}
          </Link>
          <button className="admin-sidebar__toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={`admin-sidebar__link${pathname === href ? ' admin-sidebar__link--active' : ''}`}
            >
              <Icon size={18} />
              {sidebarOpen && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">
              {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            {sidebarOpen && (
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
