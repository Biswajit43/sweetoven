import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';

const CATEGORIES = ['Birthday', 'Anniversary', 'Chocolate', 'Photo Cake', 'Custom'];

const emptyForm = { name: '', category: 'Birthday', weight: '1 Kg', price: '', description: '', image: null, imagePreview: '', isBestSeller: false, customizable: false };

export default function AdminCakes() {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCakes = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/cakes');
      setCakes(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCakes(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditing(null); setShowModal(true); };
  const openEdit = (cake) => { 
    setForm({ 
      ...cake, 
      image: null,
      imagePreview: cake.image,
      isBestSeller: cake.isBestSeller || false, 
      customizable: cake.customizable || false 
    }); 
    setEditing(cake._id); 
    setShowModal(true); 
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file, imagePreview: URL.createObjectURL(file) });
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.description || !form.imagePreview) 
      return toast.error('Please fill all required fields including image');
    
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('weight', form.weight);
      formData.append('price', form.price);
      formData.append('description', form.description);
      formData.append('isBestSeller', form.isBestSeller);
      formData.append('customizable', form.customizable);
      if (form.image) formData.append('image', form.image);
      else formData.append('image', form.imagePreview);

      if (editing) {
        await axios.put(`/api/cakes/${editing}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Cake updated!');
      } else {
        await axios.post('/api/cakes', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Cake added!');
      }
      setShowModal(false);
      fetchCakes();
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Failed to save cake'); 
    }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this cake?')) return;
    try {
      await axios.delete(`/api/cakes/${id}`);
      toast.success('Cake deleted');
      fetchCakes();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Manage Cakes</h2>
          <p style={{ color: '#9CA3AF', fontSize: 13, marginTop: 2 }}>{cakes.length} cakes total</p>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiPlus /> Add New Cake
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF' }}>Loading cakes...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {cakes.map(cake => (
            <div key={cake._id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
              <div style={{ position: 'relative', height: 180 }}>
                <img src={cake.image} alt={cake.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'} />
                {cake.isBestSeller && (
                  <div style={{ position: 'absolute', top: 10, left: 10, background: '#E91E7A', color: 'white', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>BEST SELLER</div>
                )}
                <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(cake)} style={{ width: 32, height: 32, borderRadius: 8, background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                    <FiEdit2 size={13} />
                  </button>
                  <button onClick={() => handleDelete(cake._id)} style={{ width: 32, height: 32, borderRadius: 8, background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 11, color: '#E91E7A', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{cake.category}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{cake.name}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 8 }}>{cake.weight}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: '#E91E7A' }}>₹{cake.price}</span>
                  <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: cake.isAvailable ? '#DCFCE7' : '#FEE2E2', color: cake.isAvailable ? '#166534' : '#991B1B', fontWeight: 600 }}>
                    {cake.isAvailable ? 'Available' : 'Hidden'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 700, fontSize: 18 }}>{editing ? 'Edit Cake' : 'Add New Cake'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><FiX size={20} /></button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Cake Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Chocolate Truffle" />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Category *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Price (₹) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. 899" />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Weight</label>
                  <select value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })}>
                    {['500g', '1 Kg', '1.5 Kg', '2 Kg', '3 Kg'].map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Upload Image * (Powered by Cloudinary)</label>
                <div style={{ position: 'relative', border: '2px dashed #E5E7EB', borderRadius: 10, padding: 20, textAlign: 'center', cursor: 'pointer', background: '#FAFAFA', transition: 'all 0.3s' }}>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="imageInput" />
                  <label htmlFor="imageInput" style={{ cursor: 'pointer', display: 'block' }}>
                    <FiUpload size={32} style={{ margin: '0 auto 8px', color: '#E91E7A' }} />
                    <div style={{ fontWeight: 600, color: '#374151', marginBottom: 2 }}>Click to upload or drag and drop</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>PNG, JPG, GIF up to 5MB</div>
                  </label>
                </div>
                {form.imagePreview && (
                  <div style={{ marginTop: 12, position: 'relative' }}>
                    <img src={form.imagePreview} alt="preview" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 10 }} />
                    <button onClick={() => setForm({ ...form, image: null, imagePreview: '' })} style={{ position: 'absolute', top: 5, right: 5, width: 28, height: 28, borderRadius: '50%', background: '#E91E7A', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiX size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Description *</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the cake..." rows={3} />
              </div>
              <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                  <input type="checkbox" checked={form.isBestSeller} onChange={e => setForm({ ...form, isBestSeller: e.target.checked })} style={{ width: 16, height: 16 }} />
                  Mark as Best Seller
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                  <input type="checkbox" checked={form.isAvailable !== false} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} style={{ width: 16, height: 16 }} />
                  Available / Visible
                </label>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setShowModal(false)} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ flex: 2 }}>
                  {saving ? 'Uploading...' : editing ? 'Update Cake' : 'Add Cake'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
