import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  TrendingDown, 
  TrendingUp, 
  Truck, 
  AlertTriangle, 
  ArrowRightLeft,
  ChevronRight,
  Filter,
  Download,
  Trash2,
  Edit2,
  Box,
  Factory,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  Phone,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, AppState, Supplier, PurchaseOrder, StockMovement, POStatus } from '../types';
import { cn } from '../lib/utils';

interface InventoryProps {
  state: AppState;
  setState: (value: AppState | ((val: AppState) => AppState)) => void;
}

export const InventoryView = ({ state, setState }: InventoryProps) => {
  const [view, setView] = useState<'stock' | 'suppliers' | 'orders'>('stock');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAdjustStock = (productId: string, quantity: number, type: StockMovement['type'], note: string) => {
    const movement: StockMovement = {
      id: Math.random().toString(36).substr(2, 9),
      productId,
      type,
      quantity,
      timestamp: new Date().toISOString(),
      note
    };

    setState(prev => ({
      ...prev,
      products: prev.products.map(p => {
        if (p.id === productId) {
          const adj = (type === 'Received' || type === 'Return') ? quantity : -quantity;
          return { ...p, currentStock: Math.max(0, p.currentStock + adj) };
        }
        return p;
      }),
      stockMovements: [movement, ...prev.stockMovements]
    }));
  };

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      sku: formData.get('sku') as string,
      category: formData.get('category') as string,
      unit: formData.get('unit') as string,
      currentStock: Number(formData.get('currentStock')),
      minThreshold: Number(formData.get('minThreshold')),
      reorderQuantity: Number(formData.get('reorderQuantity')),
      supplierId: formData.get('supplierId') as string,
      price: Number(formData.get('price'))
    };
    setState(prev => ({ ...prev, products: [...prev.products, newProduct] }));
    setShowAddProduct(false);
  };

  const updatePOStatus = (id: string, newStatus: POStatus) => {
    const po = state.purchaseOrders.find(p => p.id === id);
    if (newStatus === 'Received' && po) {
      handleAdjustStock(po.productId, po.quantity, 'Received', `Automatically added from received PO ${id}`);
    }
    setState(prev => ({
      ...prev,
      purchaseOrders: prev.purchaseOrders.map(p => p.id === id ? { ...p, status: newStatus } : p)
    }));
  };

  const getStockStatus = (p: Product) => {
    if (p.currentStock === 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400' };
    if (p.currentStock <= p.minThreshold) return { label: 'Low Stock', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400' };
    return { label: 'Healthy', color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' };
  };

  const exportInventory = () => {
    const headers = ['SKU', 'Name', 'Category', 'Stock', 'Min Threshold', 'Price'];
    const data = state.products.map(p => [p.sku, p.name, p.category, p.currentStock, p.minThreshold, p.price]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...data].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Inventory & Supply Chain</h2>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">Track stock levels and manage supply chain logistics</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={exportInventory}
            className="p-2 border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <Download size={18} />
          </button>
          <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
            <button onClick={() => setView('stock')} className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-all", view === 'stock' ? "bg-white dark:bg-zinc-700 shadow-sm" : "text-gray-500")}>Stock</button>
            <button onClick={() => setView('suppliers')} className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-all", view === 'suppliers' ? "bg-white dark:bg-zinc-700 shadow-sm" : "text-gray-500")}>Suppliers</button>
            <button onClick={() => setView('orders')} className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-all", view === 'orders' ? "bg-white dark:bg-zinc-700 shadow-sm" : "text-gray-500")}>Orders</button>
          </div>
          <button 
            onClick={() => setShowAddProduct(true)}
            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/20"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {view === 'stock' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800 text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-zinc-400">
                  <tr>
                    <th className="px-6 py-4">Product / SKU</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Current Stock</th>
                    <th className="px-6 py-4 text-right">Price</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {state.products.map(product => {
                    const status = getStockStatus(product);
                    return (
                      <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                              <Box size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-sm tracking-tight">{product.name}</p>
                              <p className="text-[10px] font-mono font-medium text-gray-400">{product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter", status.color)}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 rounded-lg px-2 py-1">
                            <button 
                              onClick={() => handleAdjustStock(product.id, 1, 'Wastage', 'Manual decrease')}
                              className="w-6 h-6 flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors"
                            >
                              -
                            </button>
                            <span className="font-mono font-bold text-sm w-8 text-center">{product.currentStock}</span>
                            <button 
                              onClick={() => handleAdjustStock(product.id, 1, 'Received', 'Manual increase')}
                              className="w-6 h-6 flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">{product.unit}</p>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-sm">
                          ${product.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => setSelectedProduct(product)} className="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-lg text-gray-400 hover:text-orange-600"><ChevronRight size={16} /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
             <div className="bg-orange-600 text-white p-6 rounded-xl">
                <Box size={24} className="mb-4" />
                <h3 className="font-bold mb-1">Reorder Suggestions</h3>
                <p className="text-orange-100 text-xs mb-4">Stock items currently below minimum threshold.</p>
                <div className="space-y-3">
                  {state.products.filter(p => p.currentStock <= p.minThreshold).map(p => (
                    <div key={p.id} className="bg-white/10 border border-white/20 p-3 rounded-lg">
                      <p className="text-xs font-bold">{p.name}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] opacity-70">Order: {p.reorderQuantity} {p.unit}</span>
                        <button className="bg-white text-orange-600 text-[10px] font-bold px-2 py-1 rounded">Create PO</button>
                      </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5">
                <h3 className="font-bold text-sm mb-4">Recent Movements</h3>
                <div className="space-y-4">
                   {state.stockMovements.slice(0, 5).map(m => (
                     <div key={m.id} className="flex gap-3 text-xs">
                        <div className={cn(
                          "w-6 h-6 rounded flex items-center justify-center shrink-0",
                          (m.type === 'Received' || m.type === 'Return') ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30" : "bg-red-100 text-red-600 dark:bg-red-900/30"
                        )}>
                          {(m.type === 'Received' || m.type === 'Return') ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        </div>
                        <div>
                           <p className="font-bold tracking-tight">{m.type} {m.quantity} items</p>
                           <p className="text-gray-400 mt-0.5">{m.note}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {view === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.suppliers.map(s => (
            <div key={s.id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-full group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl">
                    {s.name.charAt(0)}
                  </div>
                  <span className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full font-bold uppercase tracking-widest">{s.leadTimeDays}d Lead Time</span>
                </div>
                <h3 className="font-bold text-lg mb-4">{s.name}</h3>
                <div className="space-y-2">
                   <p className="text-xs text-gray-500 flex items-center gap-2"><Mail size={14} /> {s.email}</p>
                   <p className="text-xs text-gray-500 flex items-center gap-2"><Phone size={14} /> {s.phone}</p>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800 flex gap-2">
                   <button className="flex-1 bg-gray-50 dark:bg-zinc-800 text-xs font-bold py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">Contact</button>
                   <button className="flex-1 bg-orange-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-orange-700 transition-colors">New PO</button>
                </div>
              </div>
            </div>
          ))}
          <button className="border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-orange-500 hover:text-orange-500 transition-all group">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <p className="font-bold uppercase tracking-widest text-xs">Add Supplier</p>
          </button>
        </div>
      )}

      {view === 'orders' && (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
             <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800 text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-zinc-400">
               <tr>
                 <th className="px-6 py-4">Order ID</th>
                 <th className="px-6 py-4">Product</th>
                 <th className="px-6 py-4">Supplier</th>
                 <th className="px-6 py-4">Status</th>
                 <th className="px-6 py-4">Expected Delivery</th>
                 <th className="px-6 py-4 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
               {state.purchaseOrders.map(po => {
                 const product = state.products.find(p => p.id === po.productId);
                 const supplier = state.suppliers.find(s => s.id === po.supplierId);
                 return (
                   <tr key={po.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group text-sm">
                      <td className="px-6 py-4 font-mono font-bold tracking-tighter">{po.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold">{product?.name}</p>
                        <p className="text-[10px] text-gray-400">Qty: {po.quantity}</p>
                      </td>
                      <td className="px-6 py-4 font-medium">{supplier?.name}</td>
                      <td className="px-6 py-4">
                        <select 
                          value={po.status}
                          onChange={(e) => updatePOStatus(po.id, e.target.value as POStatus)}
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full border-none focus:ring-2 focus:ring-orange-500 outline-none",
                            po.status === 'Received' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                            po.status === 'In Transit' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                            "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-400"
                          )}
                        >
                           <option value="Ordered">Ordered</option>
                           <option value="In Transit">In Transit</option>
                           <option value="Received">Received</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 font-mono">{po.expectedDelivery}</td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded-lg text-gray-400 hover:text-orange-600"><Clock size={16} /></button>
                            <button className="p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded-lg text-gray-400 hover:text-orange-600"><Edit2 size={16} /></button>
                         </div>
                      </td>
                   </tr>
                 );
               })}
             </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddProduct(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg overflow-hidden relative">
              <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-orange-600 text-white">
                <h3 className="text-xl font-bold">Register New Product</h3>
                <button onClick={() => setShowAddProduct(false)}><X size={24} /></button>
              </div>
              <form onSubmit={handleAddProduct} className="p-6 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label>
                       <input name="name" required className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">SKU</label>
                       <input name="sku" required className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price ($)</label>
                       <input name="price" type="number" step="0.01" required className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock</label>
                       <input name="currentStock" type="number" required className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Threshold</label>
                       <input name="minThreshold" type="number" required className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reorder Qty</label>
                       <input name="reorderQuantity" type="number" required className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Supplier</label>
                       <select name="supplierId" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-orange-500">
                         {state.suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                       </select>
                    </div>
                 </div>
                 <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-all mt-4">Save Product</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

