import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, Eye, Settings, Plus, ChevronRight } from 'lucide-react';
import { productsApi } from '../../utils/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, featured: 0, outOfStock: 0 });

  useEffect(() => {
    productsApi.getAll().then(({ data }) => {
      const products = data.data;
      setStats({
        total: products.length,
        featured: products.filter(p => p.featured).length,
        outOfStock: products.filter(p => !p.inStock).length,
      });
    }).catch(() => {});
  }, []);

  const STAT_CARDS = [
    { label: 'Total Products', value: stats.total, icon: Package, color: '#2e7d32' },
    { label: 'Featured Products', value: stats.featured, icon: TrendingUp, color: '#f5a623' },
    { label: 'Out of Stock', value: stats.outOfStock, icon: Eye, color: '#ef5350' },
  ];

  const QUICK_ACTIONS = [
    { label: 'Add New Product', href: '/admin/products/new', icon: Plus, desc: 'Add a product with image upload' },
    { label: 'Manage Products', href: '/admin/products', icon: Package, desc: 'Edit, delete or feature products' },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings, desc: 'Logo, contact, social links' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-sub">Welcome back. Here's an overview of your store.</p>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid">
        {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="admin-stat-card">
            <div className="admin-stat-icon" style={{ color, background: `${color}18`, borderColor: `${color}30` }}>
              <Icon size={20} />
            </div>
            <div>
              <p className="admin-stat-value">{value}</p>
              <p className="admin-stat-label">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="admin-section-title">Quick Actions</h2>
      <div className="admin-actions-grid">
        {QUICK_ACTIONS.map(({ label, href, icon: Icon, desc }) => (
          <Link key={label} to={href} className="admin-action-card">
            <div className="admin-action-icon"><Icon size={20} /></div>
            <div>
              <p className="admin-action-title">{label}</p>
              <p className="admin-action-desc">{desc}</p>
            </div>
            <ChevronRight size={16} className="admin-action-arrow" />
          </Link>
        ))}
      </div>

      {/* Info banner */}
      <div className="admin-info-banner">
        <div>
          <h3>Need help getting started?</h3>
          <p>Upload products with Cloudinary images, configure site settings, and manage your inventory from this panel.</p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary">
          <Plus size={16} /> Add First Product
        </Link>
      </div>
    </div>
  );
}
