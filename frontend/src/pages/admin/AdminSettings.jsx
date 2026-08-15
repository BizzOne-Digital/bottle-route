import { useState, useEffect, useRef } from 'react';
import { settingsApi } from '../../utils/api';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';
import './AdminSettings.css';

export default function AdminSettings() {
  const [form, setForm] = useState({
    siteName: '', tagline: '', phone: '', email: '', address: '',
    deliveryTime: '30 Minutes', minAge: 19,
    'socialLinks.instagram': '', 'socialLinks.facebook': '',
    'socialLinks.twitter': '', 'socialLinks.tiktok': '',
    'operatingHours.open': '10:00 AM', 'operatingHours.close': '3:00 AM',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    settingsApi.get().then(({ data }) => {
      const s = data.data;
      setForm({
        siteName: s.siteName || '',
        tagline: s.tagline || '',
        phone: s.phone || '',
        email: s.email || '',
        address: s.address || '',
        deliveryTime: s.deliveryTime || '30 Minutes',
        minAge: s.minAge || 19,
        'socialLinks.instagram': s.socialLinks?.instagram || '',
        'socialLinks.facebook': s.socialLinks?.facebook || '',
        'socialLinks.twitter': s.socialLinks?.twitter || '',
        'socialLinks.tiktok': s.socialLinks?.tiktok || '',
        'operatingHours.open': s.operatingHours?.open || '10:00 AM',
        'operatingHours.close': s.operatingHours?.close || '3:00 AM',
      });
      if (s.logo) setLogoPreview(s.logo);
    }).catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('siteName', form.siteName);
      fd.append('tagline', form.tagline);
      fd.append('phone', form.phone);
      fd.append('email', form.email);
      fd.append('address', form.address);
      fd.append('deliveryTime', form.deliveryTime);
      fd.append('minAge', form.minAge);
      fd.append('socialLinks', JSON.stringify({
        instagram: form['socialLinks.instagram'],
        facebook: form['socialLinks.facebook'],
        twitter: form['socialLinks.twitter'],
        tiktok: form['socialLinks.tiktok'],
      }));
      fd.append('operatingHours', JSON.stringify({
        open: form['operatingHours.open'],
        close: form['operatingHours.close'],
      }));
      if (logoFile) fd.append('logo', logoFile);

      await settingsApi.update(fd);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const f = (key) => ({ value: form[key], onChange: (e) => setForm({ ...form, [key]: e.target.value }) });

  if (loading) return <div className="admin-loading">Loading settings...</div>;

  return (
    <div className="admin-settings">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Site Settings</h1>
        <p className="admin-page-sub">Manage logo, contact info, social links, and more.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-settings-grid">
          {/* Logo */}
          <div className="admin-settings-card">
            <h3 className="admin-settings-card__title">Logo</h3>
            <div className="admin-logo-upload" onClick={() => fileRef.current.click()}>
              {logoPreview
                ? <img src={logoPreview} alt="Logo" className="admin-logo-preview" />
                : <div className="admin-logo-placeholder"><Upload size={24} /><p>Upload Logo</p></div>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files[0]; if (f) { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); } }} />
            <p className="admin-settings-hint">Recommended: PNG with transparent background, 300×100px</p>
          </div>

          {/* General */}
          <div className="admin-settings-card">
            <h3 className="admin-settings-card__title">General</h3>
            <div className="form-group"><label className="form-label">Site Name</label><input className="form-input" {...f('siteName')} placeholder="Bottle Route" /></div>
            <div className="form-group"><label className="form-label">Tagline</label><input className="form-input" {...f('tagline')} placeholder="Drinks Delivered. Good Times Guaranteed." /></div>
            <div className="form-group"><label className="form-label">Delivery Time</label><input className="form-input" {...f('deliveryTime')} placeholder="30 Minutes" /></div>
            <div className="form-group"><label className="form-label">Minimum Age</label><input className="form-input" type="number" {...f('minAge')} /></div>
          </div>

          {/* Contact */}
          <div className="admin-settings-card">
            <h3 className="admin-settings-card__title">Contact</h3>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" {...f('phone')} placeholder="(416) 697-3510" /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" {...f('email')} placeholder="info@bottleroute.ca" /></div>
            <div className="form-group"><label className="form-label">Address</label><input className="form-input" {...f('address')} placeholder="Toronto, ON, Canada" /></div>
          </div>

          {/* Hours */}
          <div className="admin-settings-card">
            <h3 className="admin-settings-card__title">Operating Hours</h3>
            <div className="form-group"><label className="form-label">Opening Time</label><input className="form-input" {...f('operatingHours.open')} placeholder="10:00 AM" /></div>
            <div className="form-group"><label className="form-label">Closing Time</label><input className="form-input" {...f('operatingHours.close')} placeholder="3:00 AM" /></div>
          </div>

          {/* Social */}
          <div className="admin-settings-card admin-settings-card--full">
            <h3 className="admin-settings-card__title">Social Media Links</h3>
            <div className="admin-settings-social-grid">
              {['instagram', 'facebook', 'twitter', 'tiktok'].map((s) => (
                <div key={s} className="form-group">
                  <label className="form-label">{s.charAt(0).toUpperCase() + s.slice(1)}</label>
                  <input className="form-input" {...f(`socialLinks.${s}`)} placeholder={`https://${s}.com/bottleroute`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-settings-submit">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
