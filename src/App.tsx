import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  LayoutDashboard, 
  Mail, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Search,
  Plus,
  ArrowRightLeft,
  Briefcase,
  Layers,
  TrendingUp,
  AlertTriangle,
  History,
  Download,
  Filter,
  ChevronRight,
  Database,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_STATE } from './constants';
import { Lead, Product, Interaction, AppState, CRMStatus, POStatus } from './types';
import { cn } from './lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200",
      active 
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
        : "text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
    )}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm", className)}>
    {children}
  </div>
);

const StatCard = ({ label, value, subValue, icon: Icon, colorClass }: { label: string, value: string | number, subValue?: string, icon: any, colorClass: string }) => (
  <Card className="p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        {subValue && (
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">{subValue}</p>
        )}
      </div>
      <div className={cn("p-3 rounded-xl", colorClass)}>
        <Icon size={24} />
      </div>
    </div>
  </Card>
);

import { CRMView } from './components/CRMView';
import { InventoryView } from './components/InventoryView';
import { MarketingView } from './components/MarketingView';

// --- Content Sections ---

interface SettingsViewProps {
  state: AppState;
  setState: (value: AppState | ((val: AppState) => AppState)) => void;
}

const SettingsView = ({ state, setState }: SettingsViewProps) => {
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleReloadDemo = () => {
    setState(INITIAL_STATE);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Settings & Data</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Manage platform configurations and demonstration datasets</p>
        </div>
        {copiedNotification && (
          <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-lg">
            Demo dataset restored successfully!
          </span>
        )}
      </div>

      <Card className="p-6">
        <h3 className="font-bold text-base mb-4 flex items-center gap-2">
          <Database size={18} className="text-indigo-600" /> Demo Dataset Management
        </h3>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">
          The application comes seeded with a comprehensive business dataset containing enterprise leads, commercial inventory products, verified suppliers, active purchase orders, and marketing campaigns.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-center border border-gray-100 dark:border-zinc-700/50">
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{state.leads.length}</p>
            <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium mt-0.5">Leads</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-center border border-gray-100 dark:border-zinc-700/50">
            <p className="text-xl font-bold text-orange-600 dark:text-orange-400">{state.products.length}</p>
            <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium mt-0.5">Products</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-center border border-gray-100 dark:border-zinc-700/50">
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{state.suppliers.length}</p>
            <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium mt-0.5">Suppliers</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-center border border-gray-100 dark:border-zinc-700/50">
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{state.purchaseOrders.length}</p>
            <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium mt-0.5">Orders</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-center border border-gray-100 dark:border-zinc-700/50">
            <p className="text-xl font-bold text-pink-600 dark:text-pink-400">{state.campaigns.length}</p>
            <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium mt-0.5">Campaigns</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-center border border-gray-100 dark:border-zinc-700/50">
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{state.stockMovements.length}</p>
            <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium mt-0.5">Movements</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleReloadDemo}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <RotateCcw size={16} /> Reload Complete Demo Dataset
          </button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="font-bold mb-4">Account Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                <div>
                  <p className="text-sm font-bold">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive alerts for low stock and new leads</p>
                </div>
                <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" /></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                 <div>
                  <p className="text-sm font-bold">Automatic Backups</p>
                  <p className="text-xs text-gray-500">Sync data to cloud daily</p>
                </div>
                <div className="w-10 h-5 bg-gray-300 dark:bg-zinc-700 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" /></div>
              </div>
            </div>
          </div>
          <div>
             <h3 className="font-bold mb-4 text-red-500">Danger Zone</h3>
             <button 
              onClick={() => { if(confirm('Clear all data and reload defaults?')) { localStorage.clear(); window.location.reload(); } }}
              className="px-4 py-2 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
             >
              Reset All Local Data
             </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const Dashboard = ({ state }: { state: AppState }) => {
  const totalRevenue = state.leads
    .filter(l => l.status === 'Won')
    .reduce((sum, l) => sum + l.dealValue, 0);
  
  const pipelineValue = state.leads
    .filter(l => l.status !== 'Won' && l.status !== 'Lost')
    .reduce((sum, l) => sum + l.dealValue, 0);

  const lowStockItems = state.products.filter(p => p.currentStock <= p.minThreshold);
  const totalStockValue = state.products.reduce((sum, p) => sum + (p.currentStock * p.price), 0);

  const crmData = [
    { name: 'New', value: state.leads.filter(l => l.status === 'New Lead').length },
    { name: 'Contacted', value: state.leads.filter(l => l.status === 'Contacted').length },
    { name: 'Negotiating', value: state.leads.filter(l => l.status === 'Negotiating').length },
    { name: 'Won', value: state.leads.filter(l => l.status === 'Won').length },
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Business Overview</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
            <Download size={16} /> Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Sales Revenue" 
          value={`$${totalRevenue.toLocaleString()}`} 
          subValue="Total Won Deals"
          icon={TrendingUp} 
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" 
        />
        <StatCard 
          label="Pipeline Value" 
          value={`$${pipelineValue.toLocaleString()}`} 
          subValue="Projected Income"
          icon={Briefcase} 
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
        />
        <StatCard 
          label="Stock Value" 
          value={`$${totalStockValue.toLocaleString()}`} 
          subValue={`${state.products.length} Products`}
          icon={Package} 
          colorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" 
        />
        <StatCard 
          label="Low Stock Alerts" 
          value={lowStockItems.length} 
          subValue="Needs Attention"
          icon={AlertTriangle} 
          colorClass="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <Users size={18} className="text-indigo-500" /> CRM Pipeline Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={crmData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {crmData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {crmData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm font-medium text-gray-500 dark:text-zinc-400">{entry.name}:</span>
                <span className="text-sm font-bold">{entry.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <Package size={18} className="text-indigo-500" /> Inventory by Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={state.products.map(p => ({ name: p.name, stock: p.currentStock }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="stock" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <History size={18} className="text-indigo-500" /> Recent Activity
          </h3>
          <div className="space-y-4">
            {state.leads.slice(0, 3).map(lead => (
              <div key={lead.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  {lead.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New lead: <span className="text-indigo-600">{lead.name}</span> from {lead.source}</p>
                  <p className="text-xs text-gray-400">Target deal: ${lead.dealValue.toLocaleString()}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full">{lead.status}</span>
              </div>
            ))}
            {state.purchaseOrders.slice(0, 2).map(po => (
              <div key={po.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Package size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Order {po.id} - <span className="text-orange-600">{po.status}</span></p>
                  <p className="text-xs text-gray-400">Qty: {po.quantity} | Due: {po.expectedDelivery}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full">PO</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" /> Low Stock Items
          </h3>
          <div className="space-y-4">
            {lowStockItems.length > 0 ? (
              lowStockItems.map(p => (
                <div key={p.id} className="p-3 border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-lg">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-red-700 dark:text-red-400">{p.name}</p>
                    <span className="text-xs font-mono font-bold bg-white dark:bg-zinc-900 px-1.5 py-0.5 rounded">{p.currentStock}/{p.minThreshold}</span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">Suggested Reorder: {p.reorderQuantity} {p.unit}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Package size={32} className="mx-auto mb-2 opacity-20" />
                <p>All stock levels healthy</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [state, setState] = useLocalStorage<AppState>('business-hub-state-v3', INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'crm' | 'inventory' | 'marketing' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const filteredLeads = state.leads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.company.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredProducts = state.products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
    if (searchQuery) {
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Search Results for "{searchQuery}"</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Users size={18} /> Leads ({filteredLeads.length})</h3>
              <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                {filteredLeads.map(l => (
                  <div key={l.id} className="py-3 flex justify-between items-center group cursor-pointer" onClick={() => { setActiveTab('crm'); setSearchQuery(''); }}>
                    <div>
                      <p className="text-sm font-bold group-hover:text-indigo-600 transition-colors">{l.name}</p>
                      <p className="text-xs text-gray-400">{l.company}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-300" />
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Package size={18} /> Products ({filteredProducts.length})</h3>
              <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                {filteredProducts.map(p => (
                  <div key={p.id} className="py-3 flex justify-between items-center group cursor-pointer" onClick={() => { setActiveTab('inventory'); setSearchQuery(''); }}>
                    <div>
                      <p className="text-sm font-bold group-hover:text-orange-600 transition-colors">{p.name}</p>
                      <p className="text-xs text-gray-400">SKU: {p.sku}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-300" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      );
    }
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard state={state} />;
      case 'crm':
        return <CRMView state={state} setState={setState} onNavigateToMarketing={() => setActiveTab('marketing')} />;
      case 'inventory':
        return <InventoryView state={state} setState={setState} />;
      case 'marketing':
        return <MarketingView state={state} setState={setState} />;
      case 'settings':
        return <SettingsView state={state} setState={setState} />;
      default:
        return <div>Tab: {activeTab}</div>;
    }
  };

  return (
    <div className="min-h-screen font-sans flex text-gray-900 dark:text-zinc-50">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="fixed left-0 top-0 h-full bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 z-50 overflow-hidden hidden lg:block"
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 px-2 mb-8 h-10">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
              <Layers size={20} />
            </div>
            {isSidebarOpen && <h1 className="font-bold text-lg tracking-tight">BizHub Pro</h1>}
          </div>

          <nav className="flex-1 space-y-1">
            <SidebarItem 
              icon={LayoutDashboard} 
              label={isSidebarOpen ? "Dashboard" : ""} 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            <SidebarItem 
              icon={Users} 
              label={isSidebarOpen ? "CRM & Leads" : ""} 
              active={activeTab === 'crm'} 
              onClick={() => setActiveTab('crm')} 
            />
            <SidebarItem 
              icon={Package} 
              label={isSidebarOpen ? "Inventory" : ""} 
              active={activeTab === 'inventory'} 
              onClick={() => setActiveTab('inventory')} 
            />
            <SidebarItem 
              icon={Mail} 
              label={isSidebarOpen ? "Marketing" : ""} 
              active={activeTab === 'marketing'} 
              onClick={() => setActiveTab('marketing')} 
            />
          </nav>

          <div className="mt-auto space-y-1">
            <SidebarItem 
              icon={Settings} 
              label={isSidebarOpen ? "Settings" : ""} 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
            />
            <SidebarItem 
              icon={LogOut} 
              label={isSidebarOpen ? "Logout" : ""} 
              active={false} 
              onClick={() => {}} 
            />
          </div>
        </div>
      </motion.aside>

      {/* Main Page Area */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        isSidebarOpen ? "lg:ml-[260px]" : "lg:ml-[80px]"
      )}>
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-bottom border-gray-200 dark:border-zinc-800">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <div className="flex items-center gap-4 flex-1">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg lg:block hidden"
              >
                <Menu size={20} />
              </button>
              
              <div className="relative max-w-md w-full ml-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  placeholder="Search leads, products, or orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-zinc-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold leading-none">Admin User</p>
                  <p className="text-[10px] text-gray-500 dark:text-zinc-500 mt-1 uppercase tracking-wider font-medium">Small Business Owner</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center text-indigo-600 font-bold overflow-hidden">
                  <img 
                    src="https://picsum.photos/seed/user1/100/100" 
                    alt="avatar" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Nav Overlay */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-gray-200 dark:border-zinc-800 flex justify-around items-center z-50">
        <button onClick={() => setActiveTab('dashboard')} className={cn("p-3 rounded-xl", activeTab === 'dashboard' ? "text-indigo-600" : "text-gray-400")}><LayoutDashboard size={24} /></button>
        <button onClick={() => setActiveTab('crm')} className={cn("p-3 rounded-xl", activeTab === 'crm' ? "text-indigo-600" : "text-gray-400")}><Users size={24} /></button>
        <button onClick={() => setActiveTab('inventory')} className={cn("p-3 rounded-xl", activeTab === 'inventory' ? "text-indigo-600" : "text-gray-400")}><Package size={24} /></button>
        <button onClick={() => setActiveTab('marketing')} className={cn("p-3 rounded-xl", activeTab === 'marketing' ? "text-indigo-600" : "text-gray-400")}><Mail size={24} /></button>
      </div>
    </div>
  );
}
