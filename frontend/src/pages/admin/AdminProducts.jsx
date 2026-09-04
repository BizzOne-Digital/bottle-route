import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit, Star, StarOff, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi } from '../../utils/api';
import './AdminProducts.css';

const BLANK = { name: '', category: 'vodka', description: '', price: '', volume: '750ml', inStock: true, featured: false, premium: false, regularsFavourite: false };
const CATS = ['vodka', 'whisky', 'tequila', 'convenience', 'other'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    productsApi.getAll()
      .then(({ data }) => setProducts(data.data))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const openNew = () => {
    setForm(BLANK);
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      description: product.description || '',
      price: product.price,
      volume: product.volume || '',
      inStock: product.inStock,
      featured: product.featured,
      premium: product.premium,
      regularsFavourite: product.regularsFavourite,
    });
    setImagePreview(product.image);
    setImageFile(null);
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !imageFile) { toast.error('Please upload an image'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (editingId) {
        await productsApi.update(editingId, fd);
        toast.success('Product updated');
      } else {
        await productsApi.create(fd);
        toast.success('Product created');
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productsApi.delete(id);
      toast.success('Product deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="admin-products">
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-sub">{products.length} products in your store</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="admin-modal">
            <h2 className="admin-modal__title">{editingId ? 'Edit Product' : 'New Product'}</h2>
            <form onSubmit={handleSubmit} className="admin-modal__form">
              {/* Image Upload */}
              <div className="form-group">
                <label className="form-label">Product Image (Cloudinary)</label>
                <div
                  className="admin-upload-zone"
                  onClick={() => fileRef.current.click()}
                  style={{ backgroundImage: imagePreview ? `url(${imagePreview})` : 'none' }}
                >
                  {!imagePreview && (
                    <div className="admin-upload-zone__placeholder">
                      <Package size={32} />
                      <p>Click to upload image</p>
                      <span>JPG, PNG, WEBP up to 10MB</span>
                    </div>
                  )}
                  {imagePreview && <div className="admin-upload-zone__overlay">Change Image</div>}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>

              <div className="admin-modal__grid">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Grey Goose Vodka" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price ($) *</label>
                  <input className="form-input" type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required placeholder="64.99" />
                </div>
                <div className="form-group">
                  <label className="form-label">Volume</label>
                  <input className="form-input" value={form.volume} onChange={e => setForm({ ...form, volume: e.target.value })} placeholder="750ml" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief product description..." rows={3} />
              </div>

              <div className="admin-modal__toggles">
                <label className="admin-toggle">
                  <input type="checkbox" checked={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.checked })} />
                  <span>In Stock</span>
                </label>
                <label className="admin-toggle">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                  <span>Featured on Homepage</span>
                </label>
                <label className="admin-toggle">
                  <input type="checkbox" checked={form.premium} onChange={e => setForm({ ...form, premium: e.target.checked })} />
                  <span>Premium</span>
                </label>
                <label className="admin-toggle">
                  <input type="checkbox" checked={form.regularsFavourite} onChange={e => setForm({ ...form, regularsFavourite: e.target.checked })} />
                  <span>Regulars' Favourite</span>
                </label>
              </div>

              <div className="admin-modal__actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="admin-loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="admin-empty">
          <Package size={48} />
          <h3>No products yet</h3>
          <p>Click "Add Product" to get started</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="admin-table__product">
                    <img src={p.image} alt={p.name} className="admin-table__thumb" />
                    <div>
                      <p className="admin-table__name">{p.name}</p>
                      <p className="admin-table__volume">{p.volume}</p>
                    </div>
                  </td>
                  <td><span className="badge badge-green">{p.category}</span></td>
                  <td className="admin-table__price">${p.price?.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${p.inStock ? 'badge-green' : 'badge-accent'}`}>
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="admin-table__featured">
                    {p.featured ? <Star size={16} fill="#f5a623" color="#f5a623" /> : <StarOff size={16} color="var(--br-gray)" />}
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-table__btn" onClick={() => openEdit(p)} title="Edit"><Edit size={15} /></button>
                      <button className="admin-table__btn admin-table__btn--danger" onClick={() => handleDelete(p._id)} title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
