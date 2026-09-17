export type CRMStatus = 'New Lead' | 'Contacted' | 'Negotiating' | 'Won' | 'Lost';
export type CampaignStatus = 'Sent' | 'Opened' | 'Clicked';

export interface Interaction {
  id: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Note';
  timestamp: string;
  content: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: CRMStatus;
  assignedTo: string;
  dealValue: number;
  expectedCloseDate: string;
  interactions: Interaction[];
  tags: string[];
  interestedProductIds?: string[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: 'Welcome' | 'Follow-up' | 'Re-engagement' | 'Promotional' | 'Custom';
  subject: string;
  body: string;
}

export interface AutomationTrigger {
  id: string;
  name: string;
  triggerType: 'status_change' | 'days_inactive' | 'manual';
  statusTarget?: CRMStatus;
  daysThreshold?: number;
  templateId: string;
  isActive: boolean;
  lastExecuted?: string;
  executionCount: number;
}

export interface Campaign {
  id: string;
  title: string;
  template: string;
  templateCategory?: 'Welcome' | 'Follow-up' | 'Re-engagement' | 'Promotional' | 'Custom';
  subject?: string;
  scheduledAt?: string;
  sentAt?: string;
  status?: 'Draft' | 'Scheduled' | 'Sent' | 'Active';
  stats: {
    sent: number;
    opened: number;
    clicked: number;
  };
  segment: {
    tags?: string[];
    status?: CRMStatus[];
    source?: string[];
  };
}

export type StockStatus = 'OK' | 'Low' | 'Critical';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  currentStock: number;
  minThreshold: number;
  reorderQuantity: number;
  supplierId: string;
  price: number;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  leadTimeDays: number;
}

export type POStatus = 'Ordered' | 'In Transit' | 'Received';

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  productId: string;
  quantity: number;
  status: POStatus;
  orderDate: string;
  expectedDelivery: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'Received' | 'Return' | 'Wastage' | 'Sold';
  quantity: number;
  timestamp: string;
  note: string;
}

export interface AppState {
  leads: Lead[];
  campaigns: Campaign[];
  products: Product[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  stockMovements: StockMovement[];
  theme?: 'light' | 'dark';
}
