import { useState, useEffect } from 'react';
import { pricingApi } from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import './AdminPricing.css';

const emptyPlan = () => ({
  name: '', price: '', period: '', desc: '', features: [''], cta: 'Order Now', href: '/shop', highlight: false,
});
const emptyFee = () => ({ zone: '', fee: '', time: '' });

export default function AdminPricing() {
  const [plans, setPlans] = useState([]);
  const [deliveryFees, setDeliveryFees] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    pricingApi.get().then(({ data }) => {
      setPlans(data.data.plans?.length ? data.data.plans : [emptyPlan()]);
      setDeliveryFees(data.data.deliveryFees?.length ? data.data.deliveryFees : [emptyFee()]);
      setNote(data.data.note || '');
    }).catch(() => toast.error('Failed to load pricing'))
      .finally(() => setLoading(false));
  }, []);

  const updatePlan = (i, key, value) => {
    setPlans((prev) => prev.map((p, idx) => idx === i ? { ...p, [key]: value } : p));
  };
  const updateFeature = (planIdx, featIdx, value) => {
    setPlans((prev) => prev.map((p, idx) => {
      if (idx !== planIdx) return p;
      const features = [...p.features];
      features[featIdx] = value;
      return { ...p, features };
    }));
  };
  const addFeature = (planIdx) => {
    setPlans((prev) => prev.map((p, idx) => idx === planIdx ? { ...p, features: [...p.features, ''] } : p));
  };
  const removeFeature = (planIdx, featIdx) => {
    setPlans((prev) => prev.map((p, idx) => idx === planIdx ? { ...p, features: p.features.filter((_, fi) => fi !== featIdx) } : p));
  };
  const addPlan = () => setPlans((prev) => [...prev, emptyPlan()]);
  const removePlan = (i) => setPlans((prev) => prev.filter((_, idx) => idx !== i));

  const updateFee = (i, key, value) => {
    setDeliveryFees((prev) => prev.map((f, idx) => idx === i ? { ...f, [key]: value } : f));
  };
  const addFee = () => setDeliveryFees((prev) => [...prev, emptyFee()]);
  const removeFee = (i) => setDeliveryFees((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const cleanedPlans = plans.map((p) => ({ ...p, features: p.features.filter((f) => f.trim()) }));
      await pricingApi.update({ plans: cleanedPlans, deliveryFees, note });
      toast.success('Pricing saved successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading pricing...</div>;

  return (
    <div className="admin-pricing">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Pricing</h1>
        <p className="admin-page-sub">Manage plans, delivery fee zones, and the pricing page note.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Plans */}
        <div className="admin-settings-card admin-settings-card--full">
          <div className="admin-pricing__section-head">
            <h3 className="admin-settings-card__title">Plans</h3>
            <button type="button" className="admin-pricing__add-btn" onClick={addPlan}>
              <Plus size={14} /> Add Plan
            </button>
          </div>

          <div className="admin-pricing__plans">
            {plans.map((plan, i) => (
              <div key={i} className="admin-pricing__plan-card">
                <div className="admin-pricing__plan-row">
                  <button type="button" className="admin-pricing__remove-btn" onClick={() => removePlan(i)}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="form-group"><label className="form-label">Name</label>
                  <input className="form-input" value={plan.name} onChange={(e) => updatePlan(i, 'name', e.target.value)} placeholder="Standard" /></div>
                <div className="admin-pricing__inline">
                  <div className="form-group"><label className="form-label">Price</label>
                    <input className="form-input" value={plan.price} onChange={(e) => updatePlan(i, 'price', e.target.value)} placeholder="$9.99 / Free / Custom" /></div>
                  <div className="form-group"><label className="form-label">Period</label>
                    <input className="form-input" value={plan.period} onChange={(e) => updatePlan(i, 'period', e.target.value)} placeholder="/month" /></div>
                </div>
                <div className="form-group"><label className="form-label">Description</label>
                  <input className="form-input" value={plan.desc} onChange={(e) => updatePlan(i, 'desc', e.target.value)} /></div>

                <div className="form-group">
                  <label className="form-label">Features</label>
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="admin-pricing__feature-row">
                      <input className="form-input" value={f} onChange={(e) => updateFeature(i, fi, e.target.value)} placeholder="Feature description" />
                      <button type="button" className="admin-pricing__remove-btn" onClick={() => removeFeature(i, fi)}><Trash2 size={13} /></button>
                    </div>
                  ))}
                  <button type="button" className="admin-pricing__add-feature" onClick={() => addFeature(i)}>
                    <Plus size={13} /> Add Feature
                  </button>
                </div>

                <div className="admin-pricing__inline">
                  <div className="form-group"><label className="form-label">CTA Text</label>
                    <input className="form-input" value={plan.cta} onChange={(e) => updatePlan(i, 'cta', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">CTA Link</label>
                    <input className="form-input" value={plan.href} onChange={(e) => updatePlan(i, 'href', e.target.value)} /></div>
                </div>

                <label className="admin-pricing__checkbox">
                  <input type="checkbox" checked={plan.highlight} onChange={(e) => updatePlan(i, 'highlight', e.target.checked)} />
                  Highlight as "Most Popular"
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery fees */}
        <div className="admin-settings-card admin-settings-card--full">
          <div className="admin-pricing__section-head">
            <h3 className="admin-settings-card__title">Delivery Fee Zones</h3>
            <button type="button" className="admin-pricing__add-btn" onClick={addFee}>
              <Plus size={14} /> Add Zone
            </button>
          </div>
          {deliveryFees.map((fee, i) => (
            <div key={i} className="admin-pricing__fee-row">
              <input className="form-input" value={fee.zone} onChange={(e) => updateFee(i, 'zone', e.target.value)} placeholder="Zone (e.g. Within 5 km)" />
              <input className="form-input" value={fee.fee} onChange={(e) => updateFee(i, 'fee', e.target.value)} placeholder="Fee ($3.99 / FREE)" />
              <input className="form-input" value={fee.time} onChange={(e) => updateFee(i, 'time', e.target.value)} placeholder="Est. time" />
              <button type="button" className="admin-pricing__remove-btn" onClick={() => removeFee(i)}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="admin-settings-card admin-settings-card--full">
          <h3 className="admin-settings-card__title">Footer Note</h3>
          <div className="form-group">
            <textarea className="form-textarea" value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
          </div>
        </div>

        <div className="admin-settings-submit">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Pricing'}
          </button>
        </div>
      </form>
    </div>
  );
}
