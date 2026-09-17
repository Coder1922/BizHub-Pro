import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  MoreVertical, 
  Mail, 
  Phone, 
  Building2, 
  Tag, 
  Calendar,
  DollarSign,
  ChevronRight,
  Filter,
  Download,
  Trash2,
  Edit2,
  MessageSquare,
  X,
  Package,
  Sparkles,
  Send,
  Clock,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Lead, AppState, CRMStatus, Interaction, Product } from '../types';
import { cn } from '../lib/utils';

interface CRMProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>> | ((value: AppState | ((val: AppState) => AppState)) => void);
  onNavigateToMarketing?: () => void;
}

export const CRMView = ({ state, setState, onNavigateToMarketing }: CRMProps) => {
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [showAddLead, setShowAddLead] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [customNote, setCustomNote] = useState('');
  const [selectedNoteType, setSelectedNoteType] = useState<Interaction['type']>('Note');
  const [selectedProductIdToLink, setSelectedProductIdToLink] = useState('');
  const [leadFilterStatus, setLeadFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const statuses: CRMStatus[] = ['New Lead', 'Contacted', 'Negotiating', 'Won', 'Lost'];

  const selectedLead = state.leads.find(l => l.id === selectedLeadId) || null;

  const handleUpdateStatus = (id: string, newStatus: CRMStatus) => {
    setState(prev => ({
      ...prev,
      leads: prev.leads.map(l => l.id === id ? { ...l, status: newStatus } : l)
    }));
  };

  const handleAddLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const linkedProduct = formData.get('initialProduct') as string;

    const newLead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
      source: formData.get('source') as string,
      status: (formData.get('status') as CRMStatus) || 'New Lead',
      assignedTo: (formData.get('assignedTo') as string) || 'Admin',
      dealValue: Number(formData.get('dealValue')) || 0,
      expectedCloseDate: (formData.get('expectedCloseDate') as string) || new Date().toISOString().split('T')[0],
      interactions: [
        {
          id: 'int-' + Math.random().toString(36).substr(2, 7),
          type: 'Note',
          timestamp: new Date().toISOString(),
          content: 'Lead created in CRM.'
        }
      ],
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
      interestedProductIds: linkedProduct ? [linkedProduct] : []
    };

    setState(prev => ({ ...prev, leads: [...prev.leads, newLead] }));
    setShowAddLead(false);
  };

  const addInteraction = (leadId: string, type: Interaction['type'], content: string) => {
    if (!content.trim()) return;
    const interaction: Interaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      timestamp: new Date().toISOString(),
      content: content.trim()
    };
    setState(prev => ({
      ...prev,
      leads: prev.leads.map(l => l.id === leadId ? { ...l, interactions: [interaction, ...l.interactions] } : l)
    }));
    setCustomNote('');
  };

  const handleLinkProduct = (leadId: string, productId: string) => {
    if (!productId) return;
    setState(prev => ({
      ...prev,
      leads: prev.leads.map(l => {
        if (l.id === leadId) {
          const current = l.interestedProductIds || [];
          if (!current.includes(productId)) {
            const product = state.products.find(p => p.id === productId);
            const note: Interaction = {
              id: 'int-' + Math.random().toString(36).substr(2, 7),
              type: 'Note',
              timestamp: new Date().toISOString(),
              content: `Associated with product: ${product?.name || productId}`
            };
            return {
              ...l,
              interestedProductIds: [...current, productId],
              interactions: [note, ...l.interactions]
            };
          }
        }
        return l;
      })
    }));
    setSelectedProductIdToLink('');
  };

  const handleUnlinkProduct = (leadId: string, productId: string) => {
    setState(prev => ({
      ...prev,
      leads: prev.leads.map(l => {
        if (l.id === leadId) {
          return {
            ...l,
            interestedProductIds: (l.interestedProductIds || []).filter(id => id !== productId)
          };
        }
        return l;
      })
    }));
  };

  const deleteLead = (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      setState(prev => ({
        ...prev,
        leads: prev.leads.filter(l => l.id !== id)
      }));
      if (selectedLeadId === id) setSelectedLeadId(null);
    }
  };

  const exportLeads = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Deal Value', 'Close Date', 'Assigned To', 'Tags'];
    const data = state.leads.map(l => [
      l.id,
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.company}"`,
      `"${l.source}"`,
      `"${l.status}"`,
      l.dealValue,
      `"${l.expectedCloseDate}"`,
      `"${l.assignedTo}"`,
      `"${l.tags.join(';')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...data].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `crm_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const filteredLeads = state.leads.filter(lead => {
    const matchStatus = leadFilterStatus === 'all' || lead.status === leadFilterStatus;
    const matchSearch = searchTerm === '' || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">CRM & Pipeline</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              Module 1
            </span>
          </div>
          <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1">
            Manage relationships, track sales stages, log interactions & connect inventory
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onNavigateToMarketing && (
            <button
              onClick={onNavigateToMarketing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 transition-colors mr-1"
            >
              <span>Marketing Automation</span>
              <ArrowRight size={14} />
            </button>
          )}

          <button 
            onClick={exportLeads}
            title="Export Leads CSV"
            className="p-2 border border-gray-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-gray-600 dark:text-zinc-300"
          >
            <Download size={18} />
          </button>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
            <button 
              onClick={() => setView('list')}
              className={cn("px-3 py-1.5 text-sm font-semibold rounded-md transition-all", view === 'list' ? "bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-zinc-100" : "text-gray-500 hover:text-gray-700 dark:text-zinc-400")}
            >
              List View
            </button>
            <button 
              onClick={() => setView('kanban')}
              className={cn("px-3 py-1.5 text-sm font-semibold rounded-md transition-all", view === 'kanban' ? "bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-zinc-100" : "text-gray-500 hover:text-gray-700 dark:text-zinc-400")}
            >
              Pipeline Board
            </button>
          </div>

          <button 
            onClick={() => setShowAddLead(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20"
          >
            <Plus size={16} /> New Lead
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search leads by name, company, email..."
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-zinc-800 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter size={14} className="text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-zinc-400">Stage:</span>
          <select
            value={leadFilterStatus}
            onChange={e => setLeadFilterStatus(e.target.value)}
            className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-xs outline-none"
          >
            <option value="all">All Stages ({state.leads.length})</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW 1: Table List */}
      {view === 'list' && (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left min-w-[850px]">
            <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800 text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-zinc-400">
              <tr>
                <th className="px-6 py-4">Lead & Organization</th>
                <th className="px-6 py-4">Stage</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Deal Value</th>
                <th className="px-6 py-4">Target Close</th>
                <th className="px-6 py-4">Products Linked</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-sm">
              {filteredLeads.length > 0 ? (
                filteredLeads.map(lead => {
                  const linkedProducts = (lead.interestedProductIds || []).map(pid => state.products.find(p => p.id === pid)).filter(Boolean) as Product[];

                  return (
                    <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <p 
                              className="font-bold text-gray-900 dark:text-zinc-100 hover:text-indigo-600 cursor-pointer transition-colors"
                              onClick={() => setSelectedLeadId(lead.id)}
                            >
                              {lead.name}
                            </p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <Building2 size={12} /> {lead.company}
                              <span className="inline-block mx-1 text-gray-300">•</span>
                              <span className="text-indigo-600 dark:text-indigo-400">{lead.source}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <select 
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value as CRMStatus)}
                          className={cn(
                            "text-xs font-bold px-2.5 py-1 rounded-full border-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer",
                            lead.status === 'Won' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" :
                            lead.status === 'Lost' ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" :
                            lead.status === 'Negotiating' ? "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300" :
                            lead.status === 'Contacted' ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" :
                            "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                          )}
                        >
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1 text-xs text-gray-500 dark:text-zinc-400">
                          <p className="flex items-center gap-1.5"><Mail size={12} /> {lead.email}</p>
                          <p className="flex items-center gap-1.5"><Phone size={12} /> {lead.phone}</p>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono font-bold text-gray-900 dark:text-zinc-100">
                        ${lead.dealValue.toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {lead.expectedCloseDate}</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Rep: {lead.assignedTo}</span>
                      </td>

                      <td className="px-6 py-4">
                        {linkedProducts.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {linkedProducts.map(p => (
                              <span key={p.id} className="text-[10px] font-semibold bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Package size={10} /> {p.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">None linked</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => setSelectedLeadId(lead.id)} 
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors"
                            title="Open Lead Dossier & Interactions"
                          >
                            <MessageSquare size={16} />
                          </button>
                          <button 
                            onClick={() => deleteLead(lead.id)} 
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    No leads found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 2: Kanban Pipeline Board */}
      {view === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto min-w-[1100px] pb-6">
          {statuses.map(status => {
            const columnLeads = state.leads.filter(l => l.status === status);
            const columnValue = columnLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0);

            return (
              <div 
                key={status} 
                className="bg-gray-100/60 dark:bg-zinc-900/60 rounded-xl p-3 flex flex-col gap-3 min-w-[220px] border border-gray-200/60 dark:border-zinc-800"
              >
                <div className="flex items-center justify-between px-2 pt-1">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">{status}</h3>
                    <p className="text-[10px] text-gray-400 font-mono font-medium">${(columnValue / 1000).toFixed(1)}k value</p>
                  </div>
                  <span className="bg-gray-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-[11px] font-bold font-mono">
                    {columnLeads.length}
                  </span>
                </div>

                <div className="flex-1 space-y-3 min-h-[350px]">
                  {columnLeads.map(lead => {
                    const linkedCount = (lead.interestedProductIds || []).length;

                    return (
                      <motion.div 
                        layoutId={lead.id}
                        key={lead.id} 
                        onClick={() => setSelectedLeadId(lead.id)}
                        className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-1.5">
                          <p className="font-bold text-sm text-gray-900 dark:text-zinc-100 group-hover:text-indigo-600 transition-colors">
                            {lead.name}
                          </p>
                          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ${lead.dealValue.toLocaleString()}
                          </span>
                        </div>

                        <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                          <Building2 size={12} /> {lead.company}
                        </p>

                        {linkedCount > 0 && (
                          <div className="mb-2">
                            <span className="text-[10px] bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                              <Package size={10} /> {linkedCount} product{linkedCount > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-zinc-700/60 text-[10px] text-gray-400">
                          <span>{lead.interactions.length} activities</span>
                          <span className="font-medium text-gray-500 dark:text-zinc-400">{lead.source}</span>
                        </div>
                      </motion.div>
                    );
                  })}

                  {columnLeads.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-lg flex items-center justify-center text-xs text-gray-400">
                      Empty stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: Add New Lead */}
      <AnimatePresence>
        {showAddLead && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowAddLead(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden relative border border-gray-200 dark:border-zinc-800"
            >
              <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-indigo-600 text-white">
                <div>
                  <h3 className="text-lg font-bold">Create New Lead</h3>
                  <p className="text-xs text-indigo-100">Add prospect contact, projected deal value, and initial product interest</p>
                </div>
                <button onClick={() => setShowAddLead(false)} className="text-white/80 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddLead} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                    <input name="name" required placeholder="e.g. Eleanor Vance" className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                    <input name="email" type="email" required placeholder="name@company.com" className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                    <input name="phone" placeholder="555-0199" className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Company / Organization</label>
                    <input name="company" placeholder="Acme Logistics" className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lead Source</label>
                    <select name="source" className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-lg p-2.5 text-sm outline-none">
                      <option value="Social">Social Media</option>
                      <option value="Referral">Referral</option>
                      <option value="Walk-in">Walk-in</option>
                      <option value="Website">Website</option>
                      <option value="Cold Outreach">Cold Outreach</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Deal Value ($)</label>
                    <input name="dealValue" type="number" step="100" defaultValue="5000" className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-lg p-2.5 text-sm outline-none font-mono" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Close Date</label>
                    <input name="expectedCloseDate" type="date" defaultValue={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-lg p-2.5 text-sm outline-none" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Initial Pipeline Status</label>
                    <select name="status" className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-lg p-2.5 text-sm outline-none">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assign to Team Member</label>
                    <select name="assignedTo" className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-lg p-2.5 text-sm outline-none">
                      <option value="Admin">Admin (You)</option>
                      <option value="Alex">Alex</option>
                      <option value="Sarah">Sarah</option>
                      <option value="Michael">Michael</option>
                    </select>
                  </div>

                  {/* Client ↔ Product Link on Creation */}
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Interested Product (Optional Inventory Link)</label>
                    <select name="initialProduct" className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-lg p-2.5 text-sm outline-none">
                      <option value="">-- None initially --</option>
                      {state.products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.sku}) - ${p.price}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tags (Comma Separated)</label>
                    <input name="tags" placeholder="Priority, Enterprise, VIP" className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-lg p-2.5 text-sm outline-none" />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAddLead(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
                  <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20">
                    Add Lead
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DRAWER 2: Lead Full Dossier & Client ↔ Product Link */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-[60] flex items-center justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLeadId(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: 450 }}
              animate={{ x: 0 }}
              exit={{ x: 450 }}
              className="bg-white dark:bg-zinc-900 h-full w-full max-w-lg shadow-2xl relative flex flex-col border-l border-gray-200 dark:border-zinc-800"
            >
              {/* Drawer Top Header */}
              <div className="p-6 border-b border-gray-100 dark:border-zinc-800 bg-indigo-600 text-white flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">{selectedLead.name}</h3>
                    <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase">
                      {selectedLead.source}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-100 mt-1 flex items-center gap-1.5">
                    <Building2 size={13} /> {selectedLead.company} • Rep: {selectedLead.assignedTo}
                  </p>
                </div>
                <button onClick={() => setSelectedLeadId(null)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
                {/* Stage & Deal Value Strip */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-200/70 dark:border-zinc-700/60">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Pipeline Status</label>
                    <select
                      value={selectedLead.status}
                      onChange={e => handleUpdateStatus(selectedLead.id, e.target.value as CRMStatus)}
                      className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-md p-1 text-xs font-bold outline-none"
                    >
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Deal Value</label>
                    <p className="font-mono font-bold text-sm text-gray-900 dark:text-zinc-100 pt-0.5">
                      ${selectedLead.dealValue.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Direct Contact</h4>
                  <div className="space-y-1.5 text-xs">
                    <p className="flex items-center gap-2 text-gray-700 dark:text-zinc-300">
                      <Mail size={14} className="text-indigo-500" /> {selectedLead.email}
                    </p>
                    <p className="flex items-center gap-2 text-gray-700 dark:text-zinc-300">
                      <Phone size={14} className="text-indigo-500" /> {selectedLead.phone}
                    </p>
                    <p className="flex items-center gap-2 text-gray-700 dark:text-zinc-300">
                      <Calendar size={14} className="text-indigo-500" /> Expected Close: {selectedLead.expectedCloseDate}
                    </p>
                  </div>
                </div>

                {/* Client ↔ Product Link Section */}
                <div className="p-4 bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/30 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-orange-900 dark:text-orange-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Package size={14} className="text-orange-600" /> Client ↔ Product Link
                    </h4>
                    <span className="text-[10px] font-semibold text-orange-600">
                      {(selectedLead.interestedProductIds || []).length} Associated
                    </span>
                  </div>

                  {/* List of associated products */}
                  <div className="space-y-1.5">
                    {(selectedLead.interestedProductIds || []).length > 0 ? (
                      (selectedLead.interestedProductIds || []).map(pid => {
                        const product = state.products.find(p => p.id === pid);
                        if (!product) return null;

                        return (
                          <div key={pid} className="flex items-center justify-between bg-white dark:bg-zinc-900 p-2 rounded-lg border border-orange-100 dark:border-orange-900/20 text-xs">
                            <div>
                              <p className="font-bold text-gray-800 dark:text-zinc-200">{product.name}</p>
                              <p className="text-[10px] text-gray-400 font-mono">${product.price} • Stock: {product.currentStock}</p>
                            </div>
                            <button
                              onClick={() => handleUnlinkProduct(selectedLead.id, pid)}
                              className="text-gray-400 hover:text-red-600 p-1"
                              title="Unlink Product"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-gray-500 italic">No products attached to this client yet.</p>
                    )}
                  </div>

                  {/* Add Product Link Select */}
                  <div className="flex items-center gap-2 pt-1">
                    <select
                      value={selectedProductIdToLink}
                      onChange={e => setSelectedProductIdToLink(e.target.value)}
                      className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-1.5 text-xs outline-none"
                    >
                      <option value="">+ Associate a product...</option>
                      {state.products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.sku}) - ${p.price}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={!selectedProductIdToLink}
                      onClick={() => handleLinkProduct(selectedLead.id, selectedProductIdToLink)}
                      className="px-3 py-1.5 bg-orange-600 text-white rounded-lg text-xs font-bold hover:bg-orange-700 disabled:opacity-50 transition-colors"
                    >
                      Link
                    </button>
                  </div>
                </div>

                {/* Interaction History & Timeline */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Interaction History</h4>
                  <div className="space-y-3">
                    {selectedLead.interactions.map(int => (
                      <div key={int.id} className="relative pl-5 border-l-2 border-gray-100 dark:border-zinc-800 pb-2">
                        <div className={cn(
                          "absolute -left-[5px] top-1 w-2 h-2 rounded-full",
                          int.type === 'Call' ? "bg-blue-500" : 
                          int.type === 'Email' ? "bg-indigo-500" : 
                          int.type === 'Meeting' ? "bg-emerald-500" : "bg-gray-400"
                        )} />
                        <div className="flex justify-between items-start text-xs mb-0.5">
                          <span className="font-bold text-gray-700 dark:text-zinc-300">{int.type}</span>
                          <span className="text-[10px] text-gray-400">{new Date(int.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                          {int.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Action Bar: Log Custom Interaction */}
              <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 space-y-2">
                <div className="flex items-center gap-1.5">
                  {(['Call', 'Email', 'Meeting', 'Note'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedNoteType(type)}
                      className={cn(
                        "px-2.5 py-1 rounded text-[11px] font-bold transition-colors",
                        selectedNoteType === type
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    value={customNote}
                    onChange={e => setCustomNote(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') addInteraction(selectedLead.id, selectedNoteType, customNote);
                    }}
                    placeholder={`Log ${selectedNoteType.toLowerCase()} note...`}
                    className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => addInteraction(selectedLead.id, selectedNoteType, customNote)}
                    disabled={!customNote.trim()}
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-1"
                  >
                    <Send size={12} /> Log
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
