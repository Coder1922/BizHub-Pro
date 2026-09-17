import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Filter, 
  Users, 
  TrendingUp, 
  MousePointerClick, 
  Eye, 
  Zap, 
  AlertCircle, 
  Copy, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  Calendar, 
  Tag, 
  Check, 
  X,
  Play,
  RotateCcw,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState, Campaign, Lead, CRMStatus, EmailTemplate, AutomationTrigger, Interaction } from '../types';
import { cn } from '../lib/utils';

interface MarketingProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>> | ((value: AppState | ((val: AppState) => AppState)) => void);
}

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Welcome Series',
    category: 'Welcome',
    subject: 'Welcome to our community, {{name}}!',
    body: 'Hi {{name}},\n\nThank you for connecting with us! We are thrilled to welcome {{company}} to our platform. Our team is dedicated to helping you scale efficiently.\n\nBest regards,\n{{assignedTo}}'
  },
  {
    id: 'tpl-2',
    name: 'Lead Follow-up',
    category: 'Follow-up',
    subject: 'Checking in regarding our recent discussion',
    body: 'Hi {{name}},\n\nI wanted to quickly follow up on our recent chat regarding your project with {{company}}. Have you had a chance to review the details we discussed?\n\nLooking forward to hearing from you!\n\nBest,\n{{assignedTo}}'
  },
  {
    id: 'tpl-3',
    name: 'Client Re-engagement',
    category: 'Re-engagement',
    subject: 'We miss you at {{company}}! Here is a special update',
    body: 'Hi {{name}},\n\nIt has been a little while since our last touchpoint! We have rolled out several updates and new inventory additions that we think {{company}} will love.\n\nLet us know if you would like a quick demo.\n\nWarmly,\n{{assignedTo}}'
  },
  {
    id: 'tpl-4',
    name: 'Exclusive Product Promotion',
    category: 'Promotional',
    subject: 'Exclusive 15% VIP discount for {{company}}',
    body: 'Hello {{name}},\n\nAs a valued partner, we are excited to offer {{company}} an exclusive discount on our latest inventory arrivals. This offer is valid through the end of this month.\n\nReply to this email to redeem your voucher.\n\nCheers,\n{{assignedTo}}'
  }
];

const DEFAULT_TRIGGERS: AutomationTrigger[] = [
  {
    id: 'trig-1',
    name: 'Instant Welcome on New Lead',
    triggerType: 'status_change',
    statusTarget: 'New Lead',
    templateId: 'tpl-1',
    isActive: true,
    lastExecuted: '2026-09-15T14:30:00Z',
    executionCount: 14
  },
  {
    id: 'trig-2',
    name: '7-Day Inactive Follow-up',
    triggerType: 'days_inactive',
    daysThreshold: 7,
    templateId: 'tpl-2',
    isActive: true,
    lastExecuted: '2026-09-16T09:00:00Z',
    executionCount: 8
  },
  {
    id: 'trig-3',
    name: 'Contract Nudge on Negotiating',
    triggerType: 'status_change',
    statusTarget: 'Negotiating',
    templateId: 'tpl-2',
    isActive: false,
    executionCount: 3
  }
];

export const MarketingView = ({ state, setState }: MarketingProps) => {
  const [activeSubTab, setActiveSubTab] = useState<'campaigns' | 'templates' | 'triggers' | 'segments'>('campaigns');
  const [templates, setTemplates] = useState<EmailTemplate[]>(DEFAULT_TEMPLATES);
  const [triggers, setTriggers] = useState<AutomationTrigger[]>(DEFAULT_TRIGGERS);
  
  // Modals & form state
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [showTestEmailModal, setShowTestEmailModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [selectedCampaignDetail, setSelectedCampaignDetail] = useState<Campaign | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // New campaign draft state
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(DEFAULT_TEMPLATES[0].id);
  const [campaignBody, setCampaignBody] = useState(DEFAULT_TEMPLATES[0].body);
  const [segmentStatus, setSegmentStatus] = useState<string>('all');
  const [segmentTag, setSegmentTag] = useState<string>('all');
  const [segmentSource, setSegmentSource] = useState<string>('all');

  // Trigger feedback banner
  const triggerNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Calculate recipients for current campaign filter
  const getFilteredRecipients = (statusFilter = segmentStatus, tagFilter = segmentTag, sourceFilter = segmentSource): Lead[] => {
    return state.leads.filter(lead => {
      const matchStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchTag = tagFilter === 'all' || lead.tags.includes(tagFilter);
      const matchSource = sourceFilter === 'all' || lead.source === sourceFilter;
      return matchStatus && matchTag && matchSource;
    });
  };

  const currentRecipients = getFilteredRecipients();

  // Metrics
  const totalSent = state.campaigns.reduce((acc, c) => acc + (c.stats.sent || 0), 0);
  const totalOpened = state.campaigns.reduce((acc, c) => acc + (c.stats.opened || 0), 0);
  const totalClicked = state.campaigns.reduce((acc, c) => acc + (c.stats.clicked || 0), 0);
  const avgOpenRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
  const avgClickRate = totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0;
  const activeTriggersCount = triggers.filter(t => t.isActive).length;

  // Handle template selection in campaign form
  const handleSelectTemplate = (tplId: string) => {
    setSelectedTemplateId(tplId);
    const tpl = templates.find(t => t.id === tplId);
    if (tpl) {
      setCampaignSubject(tpl.subject);
      setCampaignBody(tpl.body);
    }
  };

  // Create & launch campaign
  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const recipients = currentRecipients;
    if (recipients.length === 0) {
      alert('No matching leads found for the selected segment.');
      return;
    }

    const sentCount = recipients.length;
    // Simulate realistic open rate (45% - 75%) and click rate (15% - 35%)
    const openedCount = Math.max(1, Math.round(sentCount * (0.45 + Math.random() * 0.3)));
    const clickedCount = Math.max(0, Math.round(openedCount * (0.2 + Math.random() * 0.25)));

    const chosenTpl = templates.find(t => t.id === selectedTemplateId);

    const newCampaign: Campaign = {
      id: 'cmp-' + Math.random().toString(36).substring(2, 9),
      title: campaignTitle || 'Email Blast ' + new Date().toLocaleDateString(),
      template: campaignBody,
      templateCategory: chosenTpl?.category || 'Custom',
      subject: campaignSubject || chosenTpl?.subject || 'Important Business Update',
      sentAt: new Date().toISOString(),
      status: 'Sent',
      stats: {
        sent: sentCount,
        opened: openedCount,
        clicked: clickedCount
      },
      segment: {
        status: segmentStatus !== 'all' ? [segmentStatus as CRMStatus] : undefined,
        tags: segmentTag !== 'all' ? [segmentTag] : undefined,
        source: segmentSource !== 'all' ? [segmentSource] : undefined
      }
    };

    // Record interaction in all matching recipient leads
    const updatedLeads = state.leads.map(lead => {
      if (recipients.some(r => r.id === lead.id)) {
        const newInteraction: Interaction = {
          id: 'int-' + Math.random().toString(36).substring(2, 9),
          type: 'Email',
          timestamp: new Date().toISOString(),
          content: `Marketing Campaign Sent: "${newCampaign.title}" (Subject: ${newCampaign.subject})`
        };
        return {
          ...lead,
          interactions: [newInteraction, ...lead.interactions]
        };
      }
      return lead;
    });

    setState(prev => ({
      ...prev,
      leads: updatedLeads,
      campaigns: [newCampaign, ...prev.campaigns]
    }));

    setShowCreateCampaign(false);
    setCampaignTitle('');
    triggerNotification(`Campaign "${newCampaign.title}" delivered to ${sentCount} contacts successfully!`);
  };

  // Run all active automation triggers
  const handleExecuteAutomations = () => {
    let firedCount = 0;
    let targetLeadsCount = 0;

    const updatedLeads = state.leads.map(lead => {
      let leadInteractions = [...lead.interactions];
      
      triggers.forEach(trig => {
        if (!trig.isActive) return;

        let shouldFire = false;
        if (trig.triggerType === 'status_change' && trig.statusTarget === lead.status) {
          shouldFire = true;
        } else if (trig.triggerType === 'days_inactive') {
          // Check last interaction timestamp
          const lastDate = lead.interactions[0]?.timestamp || lead.expectedCloseDate;
          if (lastDate) {
            const diffDays = Math.floor((new Date().getTime() - new Date(lastDate).getTime()) / (1000 * 3600 * 24));
            if (diffDays >= (trig.daysThreshold || 7)) {
              shouldFire = true;
            }
          } else {
            shouldFire = true;
          }
        }

        if (shouldFire) {
          firedCount++;
          targetLeadsCount++;
          const tpl = templates.find(t => t.id === trig.templateId) || templates[0];
          leadInteractions = [
            {
              id: 'trig-int-' + Math.random().toString(36).substring(2, 9),
              type: 'Email',
              timestamp: new Date().toISOString(),
              content: `Automated Trigger Executed: [${trig.name}] sent email "${tpl.name}"`
            },
            ...leadInteractions
          ];
        }
      });

      return {
        ...lead,
        interactions: leadInteractions
      };
    });

    // Update triggers execution log
    setTriggers(prev => prev.map(t => t.isActive ? {
      ...t,
      lastExecuted: new Date().toISOString(),
      executionCount: t.executionCount + 1
    } : t));

    setState(prev => ({
      ...prev,
      leads: updatedLeads
    }));

    triggerNotification(`Automation rules checked! Triggered emails logged for ${targetLeadsCount} active contacts.`);
  };

  // Toggle trigger active status
  const toggleTriggerActive = (id: string) => {
    setTriggers(prev => prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
  };

  // Template preview helper
  const renderInterpolatedBody = (body: string, lead?: Lead) => {
    const sample = lead || state.leads[0] || {
      name: 'Alex Johnson',
      company: 'TechGrowth LLC',
      assignedTo: 'Admin',
      dealValue: 15000
    };

    return body
      .replace(/{{name}}/g, sample.name || 'Friend')
      .replace(/{{company}}/g, sample.company || 'your team')
      .replace(/{{assignedTo}}/g, sample.assignedTo || 'Our Team')
      .replace(/{{dealValue}}/g, sample.dealValue ? `$${sample.dealValue.toLocaleString()}` : '$5,000');
  };

  // All unique tags and sources for segmentation
  const allTags = Array.from(new Set(state.leads.flatMap(l => l.tags))).filter(Boolean);
  const allSources = Array.from(new Set(state.leads.map(l => l.source))).filter(Boolean);
  const allStatuses: CRMStatus[] = ['New Lead', 'Contacted', 'Negotiating', 'Won', 'Lost'];

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {notificationMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-500"
          >
            <CheckCircle2 size={20} />
            <span className="text-sm font-semibold">{notificationMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Marketing Automation</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              Module 1
            </span>
          </div>
          <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1">
            Build targeted campaigns, configure automated triggers & engage your pipeline
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExecuteAutomations}
            title="Scan leads and execute active rules"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shadow-sm text-gray-700 dark:text-zinc-200"
          >
            <Zap size={16} className="text-amber-500" />
            <span>Run Automations</span>
          </button>
          <button
            onClick={() => {
              handleSelectTemplate(DEFAULT_TEMPLATES[0].id);
              setShowCreateCampaign(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20"
          >
            <Plus size={16} />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* High-level Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Total Sent</span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <Send size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2 font-mono">{totalSent.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">Across {state.campaigns.length} campaigns</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Avg. Open Rate</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <Eye size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2 font-mono text-emerald-600 dark:text-emerald-400">{avgOpenRate}%</p>
          <p className="text-xs text-gray-400 mt-1">{totalOpened.toLocaleString()} total opens</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Avg. Click Rate</span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <MousePointerClick size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2 font-mono text-purple-600 dark:text-purple-400">{avgClickRate}%</p>
          <p className="text-xs text-gray-400 mt-1">{totalClicked.toLocaleString()} link clicks</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Active Triggers</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <Zap size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2 font-mono text-amber-600 dark:text-amber-400">{activeTriggersCount} / {triggers.length}</p>
          <p className="text-xs text-gray-400 mt-1">Status & inactive rules</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-gray-200 dark:border-zinc-800 gap-2">
        <button
          onClick={() => setActiveSubTab('campaigns')}
          className={cn(
            "pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2",
            activeSubTab === 'campaigns'
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          )}
        >
          <Mail size={16} />
          <span>Campaigns ({state.campaigns.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('templates')}
          className={cn(
            "pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2",
            activeSubTab === 'templates'
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          )}
        >
          <Copy size={16} />
          <span>Email Templates ({templates.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('triggers')}
          className={cn(
            "pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2",
            activeSubTab === 'triggers'
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          )}
        >
          <Zap size={16} />
          <span>Automated Triggers ({triggers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('segments')}
          className={cn(
            "pb-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2",
            activeSubTab === 'segments'
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          )}
        >
          <Users size={16} />
          <span>Audience Segments</span>
        </button>
      </div>

      {/* Sub-tab 1: Campaigns */}
      {activeSubTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {state.campaigns.map(cmp => {
              const openPercent = cmp.stats.sent > 0 ? Math.round((cmp.stats.opened / cmp.stats.sent) * 100) : 0;
              const clickPercent = cmp.stats.sent > 0 ? Math.round((cmp.stats.clicked / cmp.stats.sent) * 100) : 0;

              return (
                <div 
                  key={cmp.id}
                  className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-bold text-base text-gray-900 dark:text-zinc-100 leading-snug">{cmp.title}</h4>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 shrink-0">
                        {cmp.templateCategory || 'Campaign'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-zinc-400 mb-4 line-clamp-1">
                      Subject: <span className="text-gray-700 dark:text-zinc-300 font-medium">{cmp.subject || cmp.template}</span>
                    </p>

                    {/* Progress Metrics */}
                    <div className="space-y-2.5 bg-gray-50 dark:bg-zinc-800/60 p-3 rounded-lg text-xs mb-4">
                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span className="text-gray-500 dark:text-zinc-400">Opens ({openPercent}%)</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400">{cmp.stats.opened} / {cmp.stats.sent}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${Math.min(100, openPercent)}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span className="text-gray-500 dark:text-zinc-400">Clicks ({clickPercent}%)</span>
                          <span className="font-mono text-purple-600 dark:text-purple-400">{cmp.stats.clicked} / {cmp.stats.sent}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${Math.min(100, clickPercent)}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-gray-400">
                    <span>Sent {cmp.sentAt ? new Date(cmp.sentAt).toLocaleDateString() : 'Just now'}</span>
                    <button
                      onClick={() => setSelectedCampaignDetail(cmp)}
                      className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      View Details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Create Campaign Card Button */}
            <button
              onClick={() => {
                handleSelectTemplate(DEFAULT_TEMPLATES[0].id);
                setShowCreateCampaign(true);
              }}
              className="border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group min-h-[220px]"
            >
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={24} />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm">Launch New Campaign</p>
                <p className="text-xs text-gray-400 mt-0.5">Blast targeted templates to segmented leads</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Templates */}
      {activeSubTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Reusable email content library with merge variables (e.g. <code className="bg-gray-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-indigo-600 dark:text-indigo-400 text-xs">{'{{name}}'}</code>, <code className="bg-gray-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-indigo-600 dark:text-indigo-400 text-xs">{'{{company}}'}</code>)
            </p>
            <button
              onClick={() => setShowCreateTemplate(true)}
              className="flex items-center gap-2 text-sm font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <Plus size={16} /> New Template
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {templates.map(tpl => (
              <div 
                key={tpl.id}
                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={cn(
                        "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full mb-1.5 inline-block",
                        tpl.category === 'Welcome' ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" :
                        tpl.category === 'Follow-up' ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                        tpl.category === 'Re-engagement' ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" :
                        "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                      )}>
                        {tpl.category}
                      </span>
                      <h4 className="font-bold text-base text-gray-900 dark:text-zinc-100">{tpl.name}</h4>
                    </div>
                    <button
                      onClick={() => setPreviewTemplate(tpl)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-indigo-600 transition-colors"
                      title="Preview with sample lead data"
                    >
                      <Eye size={18} />
                    </button>
                  </div>

                  <div className="bg-gray-50 dark:bg-zinc-800/60 p-3 rounded-lg border border-gray-100 dark:border-zinc-800 text-xs mt-2 space-y-1">
                    <p className="font-semibold text-gray-700 dark:text-zinc-300">
                      Subject: <span className="font-normal">{tpl.subject}</span>
                    </p>
                    <p className="text-gray-500 dark:text-zinc-400 line-clamp-3 whitespace-pre-line mt-1">
                      {tpl.body}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-gray-400">Ready to automate</span>
                  <button
                    onClick={() => {
                      handleSelectTemplate(tpl.id);
                      setShowCreateCampaign(true);
                    }}
                    className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    Use in Campaign <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 3: Automated Triggers */}
      {activeSubTab === 'triggers' && (
        <div className="space-y-6">
          <div className="bg-indigo-600 text-white p-6 rounded-2xl relative overflow-hidden shadow-lg">
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">
                <Zap size={16} className="text-amber-400" />
                <span>Behavioral Triggers Engine</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Automate Outreach Without Manual Follow-ups</h3>
              <p className="text-indigo-100 text-xs leading-relaxed mb-4">
                Configure conditional events that automatically send targeted templates when lead stages shift or contacts stay silent.
              </p>
              <button
                onClick={handleExecuteAutomations}
                className="bg-white text-indigo-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors shadow-sm inline-flex items-center gap-2"
              >
                <Play size={14} /> Run Trigger Evaluation Check Now
              </button>
            </div>
            <div className="absolute -right-6 -bottom-10 opacity-10 pointer-events-none">
              <Zap size={220} />
            </div>
          </div>

          <div className="space-y-3">
            {triggers.map(trigger => {
              const matchedTemplate = templates.find(t => t.id === trigger.templateId);
              return (
                <div
                  key={trigger.id}
                  className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2.5 rounded-xl shrink-0 mt-0.5",
                      trigger.isActive ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-gray-100 text-gray-400 dark:bg-zinc-800"
                    )}>
                      <Zap size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-zinc-100">{trigger.name}</h4>
                        <span className={cn(
                          "text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider",
                          trigger.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-gray-100 text-gray-500 dark:bg-zinc-800"
                        )}>
                          {trigger.isActive ? 'Active' : 'Paused'}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                        Condition:{' '}
                        {trigger.triggerType === 'status_change' ? (
                          <span className="font-medium text-gray-700 dark:text-zinc-300">
                            Lead status changes to <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{trigger.statusTarget}</span>
                          </span>
                        ) : (
                          <span className="font-medium text-gray-700 dark:text-zinc-300">
                            No interaction for <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{trigger.daysThreshold} days</span>
                          </span>
                        )}
                        {' '}&rarr; Auto-send template <span className="font-semibold text-gray-800 dark:text-zinc-200">"{matchedTemplate?.name || 'Default'}"</span>
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-gray-400 mt-2">
                        <span>Fired {trigger.executionCount} times</span>
                        {trigger.lastExecuted && (
                          <span>Last run: {new Date(trigger.lastExecuted).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <button
                      onClick={() => toggleTriggerActive(trigger.id)}
                      className={cn(
                        "w-12 h-6 rounded-full transition-colors relative cursor-pointer",
                        trigger.isActive ? "bg-indigo-600" : "bg-gray-300 dark:bg-zinc-700"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full bg-white absolute top-1 transition-transform",
                        trigger.isActive ? "right-1" : "left-1"
                      )} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-tab 4: Audience Segments */}
      {activeSubTab === 'segments' && (
        <div className="space-y-6">
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Contacts grouped dynamically by pipeline status, acquisition source, and tags for hyper-targeted communication.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* By Status */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Filter size={16} className="text-indigo-500" /> By Pipeline Stage
              </h4>
              <div className="space-y-2">
                {allStatuses.map(st => {
                  const count = state.leads.filter(l => l.status === st).length;
                  return (
                    <div 
                      key={st} 
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors text-xs cursor-pointer group"
                      onClick={() => {
                        setSegmentStatus(st);
                        setShowCreateCampaign(true);
                      }}
                    >
                      <span className="font-medium text-gray-700 dark:text-zinc-300 group-hover:text-indigo-600">{st}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-gray-600 dark:text-zinc-300">{count}</span>
                        <ArrowRight size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* By Source */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Users size={16} className="text-indigo-500" /> By Acquisition Source
              </h4>
              <div className="space-y-2">
                {allSources.length > 0 ? (
                  allSources.map(src => {
                    const count = state.leads.filter(l => l.source === src).length;
                    return (
                      <div 
                        key={src} 
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors text-xs cursor-pointer group"
                        onClick={() => {
                          setSegmentSource(src);
                          setShowCreateCampaign(true);
                        }}
                      >
                        <span className="font-medium text-gray-700 dark:text-zinc-300 group-hover:text-indigo-600">{src}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-gray-600 dark:text-zinc-300">{count}</span>
                          <ArrowRight size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-400 py-4 text-center">No sources tracked</p>
                )}
              </div>
            </div>

            {/* By Tags */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Tag size={16} className="text-indigo-500" /> By Interest & Priority Tags
              </h4>
              <div className="space-y-2">
                {allTags.length > 0 ? (
                  allTags.map(tag => {
                    const count = state.leads.filter(l => l.tags.includes(tag)).length;
                    return (
                      <div 
                        key={tag} 
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors text-xs cursor-pointer group"
                        onClick={() => {
                          setSegmentTag(tag);
                          setShowCreateCampaign(true);
                        }}
                      >
                        <span className="font-medium text-gray-700 dark:text-zinc-300 group-hover:text-indigo-600">#{tag}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded">{count}</span>
                          <ArrowRight size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-400 py-4 text-center">No tags added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: Create & Launch Campaign */}
      <AnimatePresence>
        {showCreateCampaign && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateCampaign(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative border border-gray-200 dark:border-zinc-800"
            >
              <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-indigo-600 text-white">
                <div>
                  <h3 className="text-lg font-bold">Compose & Launch Campaign</h3>
                  <p className="text-xs text-indigo-100">Send personalized email broadcasts to selected customer segments</p>
                </div>
                <button onClick={() => setShowCreateCampaign(false)} className="text-white/80 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleLaunchCampaign} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase mb-1">Campaign Title</label>
                    <input 
                      value={campaignTitle}
                      onChange={e => setCampaignTitle(e.target.value)}
                      placeholder="e.g. Q3 Partner Newsletter" 
                      required
                      className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase mb-1">Email Template</label>
                    <select 
                      value={selectedTemplateId}
                      onChange={e => handleSelectTemplate(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {templates.map(tpl => (
                        <option key={tpl.id} value={tpl.id}>{tpl.name} ({tpl.category})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase mb-1">Subject Line</label>
                  <input 
                    value={campaignSubject}
                    onChange={e => setCampaignSubject(e.target.value)}
                    placeholder="Subject line with {{name}}..." 
                    required
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                  />
                </div>

                {/* Segmentation Controls */}
                <div className="p-4 bg-gray-50 dark:bg-zinc-800/70 rounded-xl border border-gray-200 dark:border-zinc-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-300 flex items-center gap-1.5">
                      <Filter size={14} className="text-indigo-500" /> Target Audience Segment
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                      {currentRecipients.length} leads selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-gray-500 dark:text-zinc-400 mb-1">By Stage</label>
                      <select 
                        value={segmentStatus}
                        onChange={e => setSegmentStatus(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-md p-1.5 text-xs outline-none"
                      >
                        <option value="all">All Statuses ({state.leads.length})</option>
                        {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-500 dark:text-zinc-400 mb-1">By Tag</label>
                      <select 
                        value={segmentTag}
                        onChange={e => setSegmentTag(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-md p-1.5 text-xs outline-none"
                      >
                        <option value="all">All Tags</option>
                        {allTags.map(t => <option key={t} value={t}>#{t}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-500 dark:text-zinc-400 mb-1">By Source</label>
                      <select 
                        value={segmentSource}
                        onChange={e => setSegmentSource(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-md p-1.5 text-xs outline-none"
                      >
                        <option value="all">All Sources</option>
                        {allSources.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase">Email Body Content</label>
                    <div className="flex gap-1">
                      {['{{name}}', '{{company}}', '{{dealValue}}'].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setCampaignBody(prev => prev + ' ' + tag)}
                          className="text-[10px] bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 px-1.5 py-0.5 rounded hover:text-indigo-600 transition-colors"
                        >
                          +{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea 
                    rows={5}
                    value={campaignBody}
                    onChange={e => setCampaignBody(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-mono leading-relaxed" 
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateCampaign(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={currentRecipients.length === 0}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
                  >
                    <Send size={16} />
                    <span>Launch & Blast to {currentRecipients.length} Contacts</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: Create Custom Template */}
      <AnimatePresence>
        {showCreateTemplate && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateTemplate(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative border border-gray-200 dark:border-zinc-800">
              <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-indigo-600 text-white">
                <h3 className="font-bold">Add Email Template</h3>
                <button onClick={() => setShowCreateTemplate(false)}><X size={18} /></button>
              </div>
              <form 
                onSubmit={e => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const newTpl: EmailTemplate = {
                    id: 'tpl-' + Math.random().toString(36).substring(2, 9),
                    name: (form.elements.namedItem('tplName') as HTMLInputElement).value,
                    category: (form.elements.namedItem('tplCategory') as HTMLSelectElement).value as any,
                    subject: (form.elements.namedItem('tplSubject') as HTMLInputElement).value,
                    body: (form.elements.namedItem('tplBody') as HTMLTextAreaElement).value
                  };
                  setTemplates(prev => [...prev, newTpl]);
                  setShowCreateTemplate(false);
                  triggerNotification(`New template "${newTpl.name}" saved!`);
                }}
                className="p-6 space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Template Name</label>
                  <input name="tplName" required placeholder="e.g. 14-Day Check-in" className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-lg p-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Category</label>
                  <select name="tplCategory" className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-lg p-2.5 text-sm outline-none">
                    <option value="Welcome">Welcome</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Re-engagement">Re-engagement</option>
                    <option value="Promotional">Promotional</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Subject Line</label>
                  <input name="tplSubject" required placeholder="Subject with {{name}}..." className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-lg p-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Body</label>
                  <textarea name="tplBody" required rows={5} placeholder="Hello {{name}}, wanted to connect..." className="w-full bg-gray-50 dark:bg-zinc-800 border rounded-lg p-2.5 text-xs font-mono outline-none" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm">
                  Save Template
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 3: Template Live Preview with lead data */}
      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewTemplate(null)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative border border-gray-200 dark:border-zinc-800">
              <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-100 dark:bg-zinc-800">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="font-bold text-sm">Preview: {previewTemplate.name}</span>
                </div>
                <button onClick={() => setPreviewTemplate(null)}><X size={18} /></button>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg text-xs space-y-1">
                  <p><span className="text-gray-400">To:</span> {state.leads[0]?.name || 'John Doe'} &lt;{state.leads[0]?.email || 'john@example.com'}&gt;</p>
                  <p><span className="text-gray-400">Subject:</span> <strong className="text-gray-900 dark:text-zinc-100">{renderInterpolatedBody(previewTemplate.subject)}</strong></p>
                </div>

                <div className="p-4 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm whitespace-pre-line leading-relaxed text-gray-700 dark:text-zinc-300">
                  {renderInterpolatedBody(previewTemplate.body)}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      handleSelectTemplate(previewTemplate.id);
                      setPreviewTemplate(null);
                      setShowCreateCampaign(true);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
                  >
                    Select for Campaign
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 4: Campaign Detail & Analytics Modal */}
      <AnimatePresence>
        {selectedCampaignDetail && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCampaignDetail(null)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative border border-gray-200 dark:border-zinc-800">
              <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-indigo-600 text-white">
                <div>
                  <h3 className="font-bold">{selectedCampaignDetail.title}</h3>
                  <p className="text-xs text-indigo-100">Performance and Delivery Breakdown</p>
                </div>
                <button onClick={() => setSelectedCampaignDetail(null)}><X size={18} /></button>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Delivered</p>
                    <p className="font-mono text-xl font-bold mt-1">{selectedCampaignDetail.stats.sent}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-xl">
                    <p className="text-[10px] font-bold uppercase">Opened</p>
                    <p className="font-mono text-xl font-bold mt-1">{selectedCampaignDetail.stats.opened}</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-xl">
                    <p className="text-[10px] font-bold uppercase">Clicked</p>
                    <p className="font-mono text-xl font-bold mt-1">{selectedCampaignDetail.stats.clicked}</p>
                  </div>
                </div>

                <div className="text-xs space-y-2">
                  <p className="font-bold text-gray-500 uppercase tracking-wider">Email Content Preview</p>
                  <div className="p-3 bg-gray-50 dark:bg-zinc-800/80 rounded-lg whitespace-pre-line text-gray-600 dark:text-zinc-400 border border-gray-100 dark:border-zinc-800">
                    {selectedCampaignDetail.template}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedCampaignDetail(null)}
                    className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Close
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
