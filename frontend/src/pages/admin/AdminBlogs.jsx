import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit, FileText, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { blogsApi } from '../../utils/api';
import './AdminProducts.css';

const BLANK = { title: '', slug: '', excerpt: '', content: '', author: 'Bottle Route', metaTitle: '', metaDescription: '', status: 'draft' };

export default function AdminBlogs() {
  const [posts, setPosts] = useState([]);
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
    blogsApi.getAll()
      .then(({ data }) => setPosts(data.data))
      .catch(() => toast.error('Failed to load posts'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

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

  const openEdit = (post) => {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      author: post.author || '',
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      status: post.status,
    });
    setImagePreview(post.coverImage || null);
    setImageFile(null);
    setEditingId(post._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('coverImage', imageFile);

      if (editingId) {
        await blogsApi.update(editingId, fd);
        toast.success('Post updated');
      } else {
        await blogsApi.create(fd);
        toast.success('Post created');
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
    if (!confirm('Delete this post? This cannot be undone.')) return;
    try {
      await blogsApi.delete(id);
      toast.success('Post deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="admin-products">
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="admin-page-title">Blog</h1>
          <p className="admin-page-sub">{posts.length} posts</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> New Post
        </button>
      </div>

      {showForm && (
        <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="admin-modal">
            <h2 className="admin-modal__title">{editingId ? 'Edit Post' : 'New Post'}</h2>
            <form onSubmit={handleSubmit} className="admin-modal__form">
              <div className="form-group">
                <label className="form-label">Cover Image (optional)</label>
                <div
                  className="admin-upload-zone"
                  onClick={() => fileRef.current.click()}
                  style={{ backgroundImage: imagePreview ? `url(${imagePreview})` : 'none' }}
                >
                  {!imagePreview && (
                    <div className="admin-upload-zone__placeholder">
                      <FileText size={32} />
                      <p>Click to upload cover image</p>
                      <span>JPG, PNG, WEBP up to 10MB</span>
                    </div>
                  )}
                  {imagePreview && <div className="admin-upload-zone__overlay">Change Image</div>}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </div>

              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title} onChange={set('title')} required placeholder="e.g. Best Late-Night Drinks in Mississauga" />
              </div>

              <div className="admin-modal__grid">
                <div className="form-group">
                  <label className="form-label">URL Slug</label>
                  <input className="form-input" value={form.slug} onChange={set('slug')} placeholder="Auto-generated from title" />
                </div>
                <div className="form-group">
                  <label className="form-label">Author</label>
                  <input className="form-input" value={form.author} onChange={set('author')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status} onChange={set('status')}>
                    <option value="draft">Draft (hidden)</option>
                    <option value="published">Published (live)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Short Summary</label>
                <textarea className="form-textarea" value={form.excerpt} onChange={set('excerpt')} rows={2} placeholder="Shown on the blog listing card" />
              </div>

              <div className="form-group">
                <label className="form-label">Content *</label>
                <textarea className="form-textarea" value={form.content} onChange={set('content')} required rows={14}
                  placeholder={'Write the post here.\n\nLeave a blank line between paragraphs.\n## Heading\n### Smaller heading\n- List item'} />
              </div>

              <div className="admin-modal__grid">
                <div className="form-group">
                  <label className="form-label">SEO Title</label>
                  <input className="form-input" value={form.metaTitle} onChange={set('metaTitle')} placeholder="Defaults to post title" />
                </div>
                <div className="form-group">
                  <label className="form-label">SEO Description</label>
                  <input className="form-input" value={form.metaDescription} onChange={set('metaDescription')} placeholder="Defaults to summary" />
                </div>
              </div>

              <div className="admin-modal__actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="admin-loading">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="admin-empty">
          <FileText size={48} />
          <h3>No posts yet</h3>
          <p>Click "New Post" to write your first article</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Post</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p._id}>
                  <td className="admin-table__product">
                    {p.coverImage && <img src={p.coverImage} alt={p.title} className="admin-table__thumb" />}
                    <div>
                      <p className="admin-table__name">{p.title}</p>
                      <p className="admin-table__volume">/blog/{p.slug}</p>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${p.status === 'published' ? 'badge-green' : 'badge-accent'}`}>
                      {p.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{new Date(p.publishedAt || p.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-table__actions">
                      {p.status === 'published' && (
                        <a className="admin-table__btn" href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" title="View"><ExternalLink size={15} /></a>
                      )}
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
