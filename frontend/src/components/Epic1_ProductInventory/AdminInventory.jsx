/**
 * ====================================================================
 * AVENZA CLOTHING STORE - ADMIN PRODUCT INVENTORY MANAGEMENT
 * File: frontend/src/components/Epic1_ProductInventory/AdminInventory.jsx
 * 
 * 👤 TARGET USER ROLE:
 *   - Inventory Staff (Primary Operational Role for Stock Operations)
 *   - Administrator (Superuser Oversight)
 * 
 * 🎯 PURPOSE OF THIS COMPONENT:
 *   Full stock inventory management dashboard:
 *   1. Create new apparel item modal with File Upload from PC & Live Preview.
 *   2. Dynamic category creation directly inside forms.
 *   3. Price input validation preventing leading zeros.
 *   4. Clickable size toggle buttons (XS to 3XL).
 *   5. Edit existing apparel details modal.
 *   6. Toggle item availability status (Available vs. Unavailable).
 *   7. Delete product item from store database.
 * ====================================================================
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Package, Plus, Trash2, Edit, AlertTriangle, Check, ShieldCheck, ToggleLeft, ToggleRight, X, Upload, Tag, Image as ImageIcon } from 'lucide-react';

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

export const AdminInventory = () => {
  const { 
    products, 
    addProduct, 
    updateProductStock, 
    updateProductDetails, 
    toggleProductAvailability, 
    deleteProduct, 
    formatLKR,
    categories,
    addCategory
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStockId, setEditingStockId] = useState(null);
  const [tempStockValue, setTempStockValue] = useState(0);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);

  // Category addition states
  const [isAddingCategoryAddModal, setIsAddingCategoryAddModal] = useState(false);
  const [newCategoryInputAddModal, setNewCategoryInputAddModal] = useState('');
  const [isAddingCategoryEditModal, setIsAddingCategoryEditModal] = useState(false);
  const [newCategoryInputEditModal, setNewCategoryInputEditModal] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'men',
    price: '',
    originalPrice: '',
    stock: 10,
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    description: '',
    fabric: '88% Nylon, 12% Spandex',
    careInstructions: 'Machine wash cold',
    isAvailable: true
  });

  // Price sanitization logic: Prevents leading zeros (e.g. 0100 -> 100)
  const sanitizePrice = (rawVal) => {
    if (rawVal === '' || rawVal === null || rawVal === undefined) return '';
    const clean = String(rawVal).replace(/^0+/, '');
    return clean;
  };

  // Image file upload handler (Reads local PC image file & updates preview state)
  const handleFileUpload = (e, target = 'add') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        if (target === 'add') {
          setFormData(prev => ({ ...prev, image: dataUrl }));
        } else if (target === 'edit' && editingProduct) {
          setEditingProduct(prev => ({ ...prev, image: dataUrl }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || parseFloat(formData.price) <= 0) return;

    addProduct({
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice || formData.price * 1.25),
      stock: parseInt(formData.stock) || 0,
      sizes: formData.sizes.length > 0 ? formData.sizes : ['M'],
      colors: [
        { name: 'Pitch Black', hex: '#000000' },
        { name: 'Stealth Grey', hex: '#334155' }
      ],
      image: formData.image,
      gallery: [formData.image],
      description: formData.description || 'Premium Avenza clothing store apparel item.',
      fabric: formData.fabric,
      careInstructions: formData.careInstructions,
      isNew: true,
      isFeatured: false,
      isAvailable: formData.isAvailable
    });

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      category: 'men',
      price: '',
      originalPrice: '',
      stock: 10,
      sizes: ['S', 'M', 'L', 'XL'],
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
      description: '',
      fabric: '88% Nylon, 12% Spandex',
      careInstructions: 'Machine wash cold',
      isAvailable: true
    });
  };

  const handleEditOpen = (product) => {
    setEditingProduct({
      ...product,
      price: String(product.price || ''),
      originalPrice: String(product.originalPrice || ''),
      sizes: Array.isArray(product.sizes) ? product.sizes : (typeof product.sizes === 'string' ? product.sizes.split(',').map(s => s.trim()) : ['M']),
      isAvailable: product.isAvailable ?? true
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || parseFloat(editingProduct.price) <= 0) return;

    updateProductDetails(editingProduct.id, {
      name: editingProduct.name,
      category: editingProduct.category,
      price: parseFloat(editingProduct.price),
      originalPrice: parseFloat(editingProduct.originalPrice || editingProduct.price * 1.2),
      stock: parseInt(editingProduct.stock) || 0,
      sizes: editingProduct.sizes,
      description: editingProduct.description,
      fabric: editingProduct.fabric,
      careInstructions: editingProduct.careInstructions,
      image: editingProduct.image,
      isAvailable: editingProduct.isAvailable
    });

    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl card-theme shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Catalog & Warehouse Inventory Control</span>
          </div>
          <h2 className="text-2xl font-black">
            Apparel Inventory & Stock Management
          </h2>
          <p className="text-xs text-slate-500">Manage clothes catalog, pricing in LKR (Rs.), warehouse stock levels, edit product details, and toggle product availability</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Apparel Item
        </button>
      </div>

      {/* Low Stock Warning Notification for Inventory Staff (AVE-16 / AVE-24) */}
      {products.filter(p => p.stock <= 5).length > 0 && (
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-4">
          <div className="flex items-center gap-2 text-amber-500 font-extrabold text-sm uppercase tracking-wider">
            <AlertTriangle className="w-5 h-5" />
            <span>Low Stock Warning Notification (Inventory Staff Action Required)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.filter(p => p.stock <= 5).map(item => (
              <div key={item.id} className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-10 h-12 rounded-lg object-cover" />
                  <div>
                    <p className="text-xs font-bold uppercase">{item.name}</p>
                    <span className="text-[10px] text-amber-500 font-extrabold">Only {item.stock} units left!</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditingStockId(item.id);
                    setTempStockValue(item.stock);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase cursor-pointer"
                >
                  Restock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="rounded-3xl card-theme shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price (LKR)</th>
                <th className="py-4 px-4">Stock Count</th>
                <th className="py-4 px-4 text-center">Availability</th>
                <th className="py-4 px-4 text-center">Stock Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-sm">
              {products.map(item => {
                const isLow = item.stock > 0 && item.stock <= 5;
                const isOut = item.stock <= 0;
                const isAvailable = item.isAvailable ?? true;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-12 h-14 rounded-xl object-cover border border-slate-200 dark:border-zinc-800" 
                        />
                        <div>
                          <p className="font-bold uppercase text-xs">{item.name}</p>
                          <p className="text-xs text-slate-400 font-mono">SKU: {item.sku}</p>
                          <p className="text-[10px] text-slate-400">Sizes: {Array.isArray(item.sizes) ? item.sizes.join(', ') : item.sizes}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold uppercase bg-slate-100 dark:bg-zinc-900">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-black font-mono text-amber-500">
                      {formatLKR(item.price)}
                    </td>

                    {/* Stock inline editor */}
                    <td className="py-4 px-4">
                      {editingStockId === item.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={tempStockValue}
                            onChange={(e) => setTempStockValue(e.target.value)}
                            className="w-20 px-2 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 border border-amber-500 text-xs font-bold text-slate-900 dark:text-white"
                          />
                          <button
                            onClick={() => {
                              updateProductStock(item.id, tempStockValue);
                              setEditingStockId(null);
                            }}
                            className="p-1 rounded bg-emerald-500 text-white cursor-pointer"
                            title="Save Stock"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`font-extrabold text-sm font-mono ${isOut ? 'text-rose-500' : isLow ? 'text-amber-500' : ''}`}>
                            {item.stock} units
                          </span>
                          <button
                            onClick={() => {
                              setEditingStockId(item.id);
                              setTempStockValue(item.stock);
                            }}
                            className="text-xs text-slate-400 hover:text-amber-500 underline cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Availability Toggle Control */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => toggleProductAvailability(item.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold transition-colors cursor-pointer ${
                          isAvailable 
                            ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 hover:bg-emerald-500/30' 
                            : 'bg-rose-500/20 text-rose-500 border border-rose-500/40 hover:bg-rose-500/30'
                        }`}
                        title="Click to toggle Available/Unavailable status"
                      >
                        {isAvailable ? (
                          <>
                            <ToggleRight className="w-4 h-4 text-emerald-500" />
                            <span>Available</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 text-rose-500" />
                            <span>Unavailable</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Stock Status Badge */}
                    <td className="py-4 px-4 text-center">
                      {isOut ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-rose-500/20 text-rose-500 border border-rose-500/30">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center gap-1 justify-center">
                          <AlertTriangle className="w-3 h-3" /> Low ({item.stock})
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                          In Stock
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditOpen(item)}
                          className="p-2 rounded-xl text-amber-500 hover:bg-amber-500/10 transition-colors cursor-pointer"
                          title="Edit Product Details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(item.id)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD PRODUCT MODAL */}
      {isAddModalOpen && (
        <div 
          onClick={() => setIsAddModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-950 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl cursor-default"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-3">
              <h3 className="text-xl font-bold">
                Add New Apparel Item
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Compression Tank Top"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm"
                />
              </div>

              {/* Dynamic Category Selector with Inline Custom Category Addition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold uppercase text-slate-500">Category</label>
                    <button
                      type="button"
                      onClick={() => setIsAddingCategoryAddModal(!isAddingCategoryAddModal)}
                      className="text-[11px] text-amber-500 hover:underline font-bold cursor-pointer"
                    >
                      {isAddingCategoryAddModal ? 'Cancel' : '+ Add New Category'}
                    </button>
                  </div>

                  {isAddingCategoryAddModal ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Formalwear"
                        value={newCategoryInputAddModal}
                        onChange={e => setNewCategoryInputAddModal(e.target.value)}
                        className="flex-1 p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-amber-500 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newCategoryInputAddModal.trim()) {
                            const newId = addCategory(newCategoryInputAddModal.trim());
                            setFormData(prev => ({ ...prev, category: newId || newCategoryInputAddModal.trim() }));
                            setIsAddingCategoryAddModal(false);
                            setNewCategoryInputAddModal('');
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm capitalize"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Initial Stock Count</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-mono"
                  />
                </div>
              </div>

              {/* Price Fields with Prevent Leading Zeros */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Price in LKR (Rs.)</label>
                  <input
                    type="number"
                    min="1"
                    step="50"
                    required
                    placeholder="4800"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: sanitizePrice(e.target.value) })}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-mono text-amber-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Original Price (LKR)</label>
                  <input
                    type="number"
                    min="1"
                    step="50"
                    placeholder="6000"
                    value={formData.originalPrice}
                    onChange={e => setFormData({ ...formData, originalPrice: sanitizePrice(e.target.value) })}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-mono"
                  />
                </div>
              </div>

              {/* Clickable Size Selector Buttons */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Available Sizes (Click to toggle)</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map(sz => {
                    const isSelected = formData.sizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          const next = isSelected 
                            ? formData.sizes.filter(s => s !== sz) 
                            : [...formData.sizes, sz];
                          setFormData({ ...formData, sizes: next });
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-amber-500 text-black border-2 border-amber-400 shadow-md scale-105' 
                            : 'bg-slate-100 dark:bg-zinc-900 text-slate-400 border border-slate-200 dark:border-zinc-800 hover:border-amber-400'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PC Image File Upload with Auto-Fill & Live Preview */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Product Image (File Upload from PC)</label>
                <div className="flex flex-col sm:flex-row gap-4 items-center p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-dashed border-slate-300 dark:border-zinc-800">
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-slate-200 dark:bg-zinc-800 shrink-0 border border-slate-200 dark:border-zinc-700 shadow-sm">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">No Image</div>
                    )}
                    <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/75 text-[9px] text-white font-mono font-bold">Preview</span>
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase cursor-pointer transition-colors shadow-sm">
                      <Upload className="w-4 h-4" />
                      <span>Browse Image File from PC</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => handleFileUpload(e, 'add')} 
                        className="hidden" 
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Or paste Image URL (https://...)"
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Fabric composition, fit details..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-xs font-bold uppercase text-slate-500">Initial Availability Status</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase cursor-pointer ${
                    formData.isAvailable ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                  }`}
                >
                  {formData.isAvailable ? 'Available' : 'Unavailable'}
                </button>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-200 dark:bg-zinc-800 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-500 text-black font-black text-xs uppercase cursor-pointer"
                >
                  Save New Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT DETAILS MODAL */}
      {editingProduct && (
        <div 
          onClick={() => setEditingProduct(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-950 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl cursor-default"
          >
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-xl font-bold">Edit Product Details & Stock</h3>
                <p className="text-xs text-amber-500 font-mono">SKU: {editingProduct.sku}</p>
              </div>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-bold"
                />
              </div>

              {/* Dynamic Category Selector with Inline Custom Category Addition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold uppercase text-slate-500">Category</label>
                    <button
                      type="button"
                      onClick={() => setIsAddingCategoryEditModal(!isAddingCategoryEditModal)}
                      className="text-[11px] text-amber-500 hover:underline font-bold cursor-pointer"
                    >
                      {isAddingCategoryEditModal ? 'Cancel' : '+ Add New Category'}
                    </button>
                  </div>

                  {isAddingCategoryEditModal ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Formalwear"
                        value={newCategoryInputEditModal}
                        onChange={e => setNewCategoryInputEditModal(e.target.value)}
                        className="flex-1 p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-amber-500 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newCategoryInputEditModal.trim()) {
                            const newId = addCategory(newCategoryInputEditModal.trim());
                            setEditingProduct(prev => ({ ...prev, category: newId || newCategoryInputEditModal.trim() }));
                            setIsAddingCategoryEditModal(false);
                            setNewCategoryInputEditModal('');
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <select
                      value={editingProduct.category}
                      onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm capitalize"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingProduct.stock}
                    onChange={e => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-mono"
                  />
                </div>
              </div>

              {/* Price Fields with Prevent Leading Zeros */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Price (LKR)</label>
                  <input
                    type="number"
                    min="1"
                    step="50"
                    required
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({ ...editingProduct, price: sanitizePrice(e.target.value) })}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-mono text-amber-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Original Price (LKR)</label>
                  <input
                    type="number"
                    min="1"
                    step="50"
                    value={editingProduct.originalPrice || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, originalPrice: sanitizePrice(e.target.value) })}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-mono"
                  />
                </div>
              </div>

              {/* Clickable Size Selector Buttons */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Available Sizes (Click to toggle)</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map(sz => {
                    const isSelected = Array.isArray(editingProduct.sizes) && editingProduct.sizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          const current = Array.isArray(editingProduct.sizes) ? editingProduct.sizes : [];
                          const next = isSelected 
                            ? current.filter(s => s !== sz) 
                            : [...current, sz];
                          setEditingProduct({ ...editingProduct, sizes: next });
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-amber-500 text-black border-2 border-amber-400 shadow-md scale-105' 
                            : 'bg-slate-100 dark:bg-zinc-900 text-slate-400 border border-slate-200 dark:border-zinc-800 hover:border-amber-400'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PC Image File Upload with Auto-Fill & Live Preview */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Product Image (File Upload from PC)</label>
                <div className="flex flex-col sm:flex-row gap-4 items-center p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-dashed border-slate-300 dark:border-zinc-800">
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-slate-200 dark:bg-zinc-800 shrink-0 border border-slate-200 dark:border-zinc-700 shadow-sm">
                    {editingProduct.image ? (
                      <img src={editingProduct.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">No Image</div>
                    )}
                    <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/75 text-[9px] text-white font-mono font-bold">Preview</span>
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase cursor-pointer transition-colors shadow-sm">
                      <Upload className="w-4 h-4" />
                      <span>Browse Image File from PC</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => handleFileUpload(e, 'edit')} 
                        className="hidden" 
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Or paste Image URL (https://...)"
                      value={editingProduct.image}
                      onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={editingProduct.description || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-xs font-bold uppercase text-slate-500">Availability Control</span>
                <button
                  type="button"
                  onClick={() => setEditingProduct({ ...editingProduct, isAvailable: !editingProduct.isAvailable })}
                  className={`px-4 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-colors cursor-pointer ${
                    editingProduct.isAvailable ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                  }`}
                >
                  {editingProduct.isAvailable ? 'Available' : 'Unavailable'}
                </button>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-200 dark:bg-zinc-800 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-500 text-black font-black text-xs uppercase cursor-pointer"
                >
                  Update Product Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
