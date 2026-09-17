import { AppState } from './types';

export const INITIAL_STATE: AppState = {
  leads: [
    {
      id: 'lead-1',
      name: 'Elena Rostova',
      email: 'elena.rostova@horizonmed.org',
      phone: '+1 (555) 234-8901',
      company: 'Horizon Medical Systems',
      source: 'Referral',
      status: 'Negotiating',
      assignedTo: 'Sarah',
      dealValue: 28500,
      expectedCloseDate: '2026-10-15',
      interactions: [
        {
          id: 'int-101',
          type: 'Meeting',
          timestamp: '2026-09-14T14:30:00Z',
          content: 'Reviewed hardware specifications for 10 diagnostic workstations. Discussed HIPAA compliance.'
        },
        {
          id: 'int-102',
          type: 'Call',
          timestamp: '2026-09-10T11:00:00Z',
          content: 'Discussed volume discount and SLA response requirements with procurement director.'
        }
      ],
      tags: ['Enterprise', 'Healthcare', 'High Priority'],
      interestedProductIds: ['prod-1', 'prod-7']
    },
    {
      id: 'lead-2',
      name: 'Marcus Vance',
      email: 'm.vance@apexlogistics.io',
      phone: '+1 (555) 345-6789',
      company: 'Apex Logistics Hub',
      source: 'Website',
      status: 'Won',
      assignedTo: 'Alex',
      dealValue: 42000,
      expectedCloseDate: '2026-09-05',
      interactions: [
        {
          id: 'int-201',
          type: 'Note',
          timestamp: '2026-09-05T16:00:00Z',
          content: 'Contract fully executed. Initial shipment of handheld scanners and core switches scheduled.'
        },
        {
          id: 'int-202',
          type: 'Meeting',
          timestamp: '2026-08-28T15:00:00Z',
          content: 'Finalized contract terms and 3-year warranty add-on package with COO.'
        }
      ],
      tags: ['Enterprise', 'VIP', 'Logistics'],
      interestedProductIds: ['prod-3', 'prod-5']
    },
    {
      id: 'lead-3',
      name: 'Chloe Chen',
      email: 'chloe@luminacreative.studio',
      phone: '+1 (555) 456-7890',
      company: 'Lumina Creative Studio',
      source: 'Social',
      status: 'Contacted',
      assignedTo: 'Michael',
      dealValue: 14200,
      expectedCloseDate: '2026-10-28',
      interactions: [
        {
          id: 'int-301',
          type: 'Email',
          timestamp: '2026-09-12T09:15:00Z',
          content: 'Sent studio equipment catalog and high-DPI display calibration brochure.'
        },
        {
          id: 'int-302',
          type: 'Call',
          timestamp: '2026-09-08T16:45:00Z',
          content: 'Discovery call regarding ergonomic workstation overhaul for 12 graphic designers.'
        }
      ],
      tags: ['Creative', 'Q4 Target'],
      interestedProductIds: ['prod-2', 'prod-6']
    },
    {
      id: 'lead-4',
      name: 'Devon Bailey',
      email: 'dbailey@kinetixrobotics.com',
      phone: '+1 (555) 567-8901',
      company: 'Kinetix Robotics',
      source: 'Cold Outreach',
      status: 'New Lead',
      assignedTo: 'Admin',
      dealValue: 36000,
      expectedCloseDate: '2026-11-20',
      interactions: [
        {
          id: 'int-401',
          type: 'Email',
          timestamp: '2026-09-15T08:30:00Z',
          content: 'Introductory outreach sent covering rugged handheld scanner integrations.'
        }
      ],
      tags: ['Industrial', 'Robotics', 'Priority'],
      interestedProductIds: ['prod-1', 'prod-5']
    },
    {
      id: 'lead-5',
      name: 'Sophia Patel',
      email: 'spatel@greengridenergy.com',
      phone: '+1 (555) 678-9012',
      company: 'GreenGrid Renewable Energy',
      source: 'Partner',
      status: 'Won',
      assignedTo: 'Sarah',
      dealValue: 54000,
      expectedCloseDate: '2026-09-02',
      interactions: [
        {
          id: 'int-501',
          type: 'Note',
          timestamp: '2026-09-02T13:20:00Z',
          content: 'Payment processed for 6 commercial battery power systems and backup racks.'
        },
        {
          id: 'int-502',
          type: 'Call',
          timestamp: '2026-08-22T10:00:00Z',
          content: 'Confirmed electrical engineering sign-off on backup power ratings.'
        }
      ],
      tags: ['VIP', 'Renewable', 'Gov Contract'],
      interestedProductIds: ['prod-4', 'prod-10']
    },
    {
      id: 'lead-6',
      name: 'Julian Alvarez',
      email: 'j.alvarez@omnicorfin.com',
      phone: '+1 (555) 789-0123',
      company: 'Omnicor Financial Services',
      source: 'Referral',
      status: 'Negotiating',
      assignedTo: 'Alex',
      dealValue: 21500,
      expectedCloseDate: '2026-10-05',
      interactions: [
        {
          id: 'int-601',
          type: 'Meeting',
          timestamp: '2026-09-16T15:00:00Z',
          content: 'Executive meeting on enterprise network security and WiFi 6 access points.'
        },
        {
          id: 'int-602',
          type: 'Email',
          timestamp: '2026-09-11T13:40:00Z',
          content: 'Provided updated quote with 5-year hardware maintenance agreement.'
        }
      ],
      tags: ['Fintech', 'Security', 'Enterprise'],
      interestedProductIds: ['prod-3', 'prod-11']
    },
    {
      id: 'lead-7',
      name: 'Aaliyah Brooks',
      email: 'brooks@beaconarch.design',
      phone: '+1 (555) 890-1234',
      company: 'Beacon Architectural Group',
      source: 'Website',
      status: 'Contacted',
      assignedTo: 'Michael',
      dealValue: 18900,
      expectedCloseDate: '2026-11-01',
      interactions: [
        {
          id: 'int-701',
          type: 'Call',
          timestamp: '2026-09-13T10:30:00Z',
          content: 'Detailed discussion on height-adjustable standing desks and monitor mounting arms.'
        }
      ],
      tags: ['Architecture', 'Commercial', 'Design'],
      interestedProductIds: ['prod-2', 'prod-9']
    },
    {
      id: 'lead-8',
      name: 'Nathaniel Frost',
      email: 'nfrost@blueharborfreight.com',
      phone: '+1 (555) 901-2345',
      company: 'BlueHarbor Logistics',
      source: 'Cold Outreach',
      status: 'Lost',
      assignedTo: 'Alex',
      dealValue: 16500,
      expectedCloseDate: '2026-08-30',
      interactions: [
        {
          id: 'int-801',
          type: 'Call',
          timestamp: '2026-08-29T14:10:00Z',
          content: 'Client opted to freeze fiscal year Capex spend. Revisit next quarter in Q1.'
        }
      ],
      tags: ['Freight', 'Follow-up Q1'],
      interestedProductIds: ['prod-5']
    },
    {
      id: 'lead-9',
      name: 'Isabella Cruz',
      email: 'icruz@velocecloud.net',
      phone: '+1 (555) 012-3456',
      company: 'Veloce Cloud Infrastructure',
      source: 'Social',
      status: 'Won',
      assignedTo: 'Admin',
      dealValue: 31000,
      expectedCloseDate: '2026-09-08',
      interactions: [
        {
          id: 'int-901',
          type: 'Note',
          timestamp: '2026-09-08T17:30:00Z',
          content: 'Deployment completed for high-density rack storage arrays and core switches.'
        },
        {
          id: 'int-902',
          type: 'Meeting',
          timestamp: '2026-08-31T11:00:00Z',
          content: 'Architecture signoff review with Head of Cloud Engineering.'
        }
      ],
      tags: ['Cloud', 'High Priority', 'VIP'],
      interestedProductIds: ['prod-7', 'prod-11']
    },
    {
      id: 'lead-10',
      name: 'Liam Gallagher',
      email: 'lgallagher@peakviewacademy.edu',
      phone: '+1 (555) 123-7890',
      company: 'Peakview Educational Academy',
      source: 'Walk-in',
      status: 'New Lead',
      assignedTo: 'Sarah',
      dealValue: 12500,
      expectedCloseDate: '2026-11-10',
      interactions: [
        {
          id: 'int-1001',
          type: 'Meeting',
          timestamp: '2026-09-16T11:15:00Z',
          content: 'Campus tech director visited showroom to test multifunction enterprise printers.'
        }
      ],
      tags: ['Education', 'Volume Order'],
      interestedProductIds: ['prod-6', 'prod-12']
    },
    {
      id: 'lead-11',
      name: 'Zara Morrison',
      email: 'zara.m@solsticehotels.com',
      phone: '+1 (555) 234-5671',
      company: 'Solstice Luxury Resorts',
      source: 'Referral',
      status: 'Negotiating',
      assignedTo: 'Michael',
      dealValue: 39000,
      expectedCloseDate: '2026-10-20',
      interactions: [
        {
          id: 'int-1101',
          type: 'Meeting',
          timestamp: '2026-09-15T16:20:00Z',
          content: 'Presented custom finish options for corporate suites and executive meeting rooms.'
        },
        {
          id: 'int-1102',
          type: 'Call',
          timestamp: '2026-09-09T14:00:00Z',
          content: 'Reviewed volume procurement discount tiers with Regional GM.'
        }
      ],
      tags: ['Hospitality', 'Interior Upgrade', 'High Value'],
      interestedProductIds: ['prod-2', 'prod-10']
    },
    {
      id: 'lead-12',
      name: 'Gabriel Reyes',
      email: 'greyes@vanguardbiolabs.com',
      phone: '+1 (555) 345-9876',
      company: 'Vanguard Precision Labs',
      source: 'Website',
      status: 'Contacted',
      assignedTo: 'Admin',
      dealValue: 24000,
      expectedCloseDate: '2026-10-30',
      interactions: [
        {
          id: 'int-1201',
          type: 'Call',
          timestamp: '2026-09-14T09:45:00Z',
          content: 'Discussed cleanroom-compatible workstations and ultra-HD conference kits.'
        }
      ],
      tags: ['R&D', 'Lab Tech', 'Enterprise'],
      interestedProductIds: ['prod-1', 'prod-8']
    }
  ],
  campaigns: [
    {
      id: 'cmp-1',
      title: 'Q3 Enterprise Infrastructure Modernization',
      template: 'Upgrade your business network with enterprise routing and high-performance server clusters.',
      templateCategory: 'Promotional',
      subject: 'Special Equipment Upgrade Incentives for {{company}}',
      sentAt: '2026-09-10T09:00:00Z',
      status: 'Sent',
      stats: { sent: 620, opened: 415, clicked: 168 },
      segment: { status: ['Won', 'Negotiating'] }
    },
    {
      id: 'cmp-2',
      title: 'New Partner Onboarding & Welcome Suite',
      template: 'Welcome to our platform, {{name}}! We look forward to powering {{company}} with top-tier hardware.',
      templateCategory: 'Welcome',
      subject: 'Welcome to our verified business community, {{name}}!',
      sentAt: '2026-09-12T14:30:00Z',
      status: 'Sent',
      stats: { sent: 180, opened: 142, clicked: 58 },
      segment: { status: ['New Lead'] }
    },
    {
      id: 'cmp-3',
      title: 'Mid-Year VIP Equipment Upgrade Incentives',
      template: 'Exclusive 15% VIP discount on our latest ergonomic furniture and high-definition displays.',
      templateCategory: 'Promotional',
      subject: 'Exclusive Partner Discount for {{company}}',
      sentAt: '2026-08-25T10:15:00Z',
      status: 'Sent',
      stats: { sent: 450, opened: 312, clicked: 120 },
      segment: { tags: ['VIP', 'Enterprise'] }
    },
    {
      id: 'cmp-4',
      title: 'Client Re-engagement: Autumn Tech Catalog',
      template: 'It has been a while since our last touchpoint! Explore new arrivals in smart power and wireless APs.',
      templateCategory: 'Re-engagement',
      subject: 'We miss you at {{company}}! Check out our new 2026 catalog',
      sentAt: '2026-09-01T11:00:00Z',
      status: 'Sent',
      stats: { sent: 340, opened: 198, clicked: 64 },
      segment: { status: ['Contacted'] }
    },
    {
      id: 'cmp-5',
      title: 'Smart Grid & Solar Solutions Webinar Invitation',
      template: 'Join our technical briefing on commercial energy storage and battery backup solutions.',
      templateCategory: 'Follow-up',
      subject: 'Live Technical Briefing: Industrial Power Continuity',
      sentAt: '2026-09-14T16:00:00Z',
      status: 'Sent',
      stats: { sent: 290, opened: 185, clicked: 76 },
      segment: { source: ['Partner', 'Website'] }
    },
    {
      id: 'cmp-6',
      title: 'High-Speed Networking Architecture Brief',
      template: 'Discover best practices for multi-gigabit campus switching and zero-trust perimeter setup.',
      templateCategory: 'Custom',
      subject: 'Modernizing Campus Switching for High Density Operations',
      sentAt: '2026-08-18T13:00:00Z',
      status: 'Sent',
      stats: { sent: 380, opened: 236, clicked: 92 },
      segment: { status: ['Negotiating', 'Won'] }
    },
    {
      id: 'cmp-7',
      title: 'Executive Ergonomics & Workplace Health',
      template: 'Boost team productivity and ergonomics with certified Herman Miller seating and standing desks.',
      templateCategory: 'Follow-up',
      subject: 'Investing in Team Wellbeing: Certified Ergonomics Guide',
      sentAt: '2026-09-05T08:45:00Z',
      status: 'Sent',
      stats: { sent: 240, opened: 170, clicked: 68 },
      segment: { tags: ['Creative', 'Architecture'] }
    },
    {
      id: 'cmp-8',
      title: 'Quarterly Supply Chain Optimization Round-up',
      template: 'Industry insights on real-time inventory tracking, barcode automation, and order fulfillment.',
      templateCategory: 'Custom',
      subject: 'Q3 Supply Chain Benchmarks & Inventory Best Practices',
      sentAt: '2026-09-08T15:20:00Z',
      status: 'Sent',
      stats: { sent: 510, opened: 330, clicked: 114 },
      segment: { tags: ['Logistics', 'Enterprise'] }
    },
    {
      id: 'cmp-9',
      title: 'Early Bird Fiscal Year End Fleet Discount',
      template: 'Lock in competitive hardware leasing rates before the close of fiscal year 2026.',
      templateCategory: 'Promotional',
      subject: 'Fiscal Year End Capital Budgeting: Hardware Special',
      sentAt: '2026-09-15T12:00:00Z',
      status: 'Sent',
      stats: { sent: 490, opened: 305, clicked: 132 },
      segment: { status: ['Negotiating'] }
    },
    {
      id: 'cmp-10',
      title: 'Cybersecurity & Unified Switch Deployment Guide',
      template: 'A step-by-step implementation guide for secure network zoning and automated threat isolation.',
      templateCategory: 'Follow-up',
      subject: 'Network Security Whitepaper for Financial & Cloud Teams',
      sentAt: '2026-09-03T10:30:00Z',
      status: 'Sent',
      stats: { sent: 275, opened: 195, clicked: 84 },
      segment: { tags: ['Fintech', 'Cloud'] }
    }
  ],
  products: [
    {
      id: 'prod-1',
      name: 'Dell Precision 5860 Workstation',
      sku: 'WRK-5860',
      category: 'Electronics',
      unit: 'pcs',
      currentStock: 8,
      minThreshold: 5,
      reorderQuantity: 10,
      supplierId: 'sup-1',
      price: 2450
    },
    {
      id: 'prod-2',
      name: 'Herman Miller Aeron Ergonomic Chair',
      sku: 'CHR-AER88',
      category: 'Furniture',
      unit: 'pcs',
      currentStock: 4,
      minThreshold: 6,
      reorderQuantity: 15,
      supplierId: 'sup-2',
      price: 1195
    },
    {
      id: 'prod-3',
      name: 'Cisco Catalyst 9300 48-Port Switch',
      sku: 'NET-CS9300',
      category: 'Networking',
      unit: 'pcs',
      currentStock: 12,
      minThreshold: 4,
      reorderQuantity: 8,
      supplierId: 'sup-3',
      price: 3850
    },
    {
      id: 'prod-4',
      name: 'Tesla Powerwall 3 Commercial Unit',
      sku: 'PWR-PW3',
      category: 'Energy & Power',
      unit: 'units',
      currentStock: 2,
      minThreshold: 3,
      reorderQuantity: 5,
      supplierId: 'sup-4',
      price: 8200
    },
    {
      id: 'prod-5',
      name: 'Zebra TC52x Rugged Handheld Scanner',
      sku: 'SCN-ZB52',
      category: 'Logistics Tech',
      unit: 'pcs',
      currentStock: 24,
      minThreshold: 8,
      reorderQuantity: 20,
      supplierId: 'sup-5',
      price: 890
    },
    {
      id: 'prod-6',
      name: 'Apple Studio Display 27-inch 5K',
      sku: 'DSP-AP27',
      category: 'Electronics',
      unit: 'pcs',
      currentStock: 14,
      minThreshold: 5,
      reorderQuantity: 10,
      supplierId: 'sup-1',
      price: 1599
    },
    {
      id: 'prod-7',
      name: 'Synology RackStation RS3621xs+ NAS',
      sku: 'SRV-RS36',
      category: 'Storage & Servers',
      unit: 'units',
      currentStock: 5,
      minThreshold: 2,
      reorderQuantity: 4,
      supplierId: 'sup-3',
      price: 4200
    },
    {
      id: 'prod-8',
      name: 'Logitech Rally Plus Ultra-HD AV Kit',
      sku: 'AV-RALLY',
      category: 'Audio Visual',
      unit: 'sets',
      currentStock: 7,
      minThreshold: 3,
      reorderQuantity: 6,
      supplierId: 'sup-6',
      price: 2650
    },
    {
      id: 'prod-9',
      name: 'Steelcase Migration Standing Desk Pro',
      sku: 'DSK-SCM90',
      category: 'Furniture',
      unit: 'pcs',
      currentStock: 3,
      minThreshold: 5,
      reorderQuantity: 12,
      supplierId: 'sup-2',
      price: 850
    },
    {
      id: 'prod-10',
      name: 'Schneider Electric Smart-UPS 3000VA',
      sku: 'PWR-UPS3K',
      category: 'Energy & Power',
      unit: 'units',
      currentStock: 9,
      minThreshold: 3,
      reorderQuantity: 6,
      supplierId: 'sup-4',
      price: 1750
    },
    {
      id: 'prod-11',
      name: 'Ubiquiti UniFi Enterprise WiFi 6 AP',
      sku: 'WIFI-U6ENT',
      category: 'Networking',
      unit: 'pcs',
      currentStock: 32,
      minThreshold: 10,
      reorderQuantity: 25,
      supplierId: 'sup-3',
      price: 279
    },
    {
      id: 'prod-12',
      name: 'Epson WorkForce Enterprise Color MFD',
      sku: 'PRN-WF20K',
      category: 'Printing & Office',
      unit: 'units',
      currentStock: 6,
      minThreshold: 2,
      reorderQuantity: 4,
      supplierId: 'sup-6',
      price: 3400
    }
  ],
  suppliers: [
    { 
      id: 'sup-1', 
      name: 'Apex Global Computing', 
      email: 'partnerships@apexglobal.tech', 
      phone: '+1 (800) 555-0144', 
      leadTimeDays: 5 
    },
    { 
      id: 'sup-2', 
      name: 'Nova Ergonomics Group', 
      email: 'supply@novaergo.com', 
      phone: '+1 (800) 555-0182', 
      leadTimeDays: 12 
    },
    { 
      id: 'sup-3', 
      name: 'Quantum Fiber & Networking', 
      email: 'enterprise@quantumnet.io', 
      phone: '+1 (888) 555-0199', 
      leadTimeDays: 7 
    },
    { 
      id: 'sup-4', 
      name: 'GreenVolt Power & Grid Solutions', 
      email: 'orders@greenvoltpower.com', 
      phone: '+1 (866) 555-0210', 
      leadTimeDays: 14 
    },
    { 
      id: 'sup-5', 
      name: 'BarCode & Supply Chain Dynamics', 
      email: 'logistics@dynamicsc.com', 
      phone: '+1 (800) 555-0320', 
      leadTimeDays: 4 
    },
    { 
      id: 'sup-6', 
      name: 'Apex Audiovisual & Office Tech', 
      email: 'contracts@apexaudio.com', 
      phone: '+1 (877) 555-0450', 
      leadTimeDays: 8 
    }
  ],
  purchaseOrders: [
    {
      id: 'PO-2026-001',
      supplierId: 'sup-2',
      productId: 'prod-2',
      quantity: 15,
      status: 'In Transit',
      orderDate: '2026-09-08',
      expectedDelivery: '2026-09-20'
    },
    {
      id: 'PO-2026-002',
      supplierId: 'sup-4',
      productId: 'prod-4',
      quantity: 5,
      status: 'Ordered',
      orderDate: '2026-09-12',
      expectedDelivery: '2026-09-26'
    },
    {
      id: 'PO-2026-003',
      supplierId: 'sup-2',
      productId: 'prod-9',
      quantity: 12,
      status: 'In Transit',
      orderDate: '2026-09-10',
      expectedDelivery: '2026-09-22'
    },
    {
      id: 'PO-2026-004',
      supplierId: 'sup-1',
      productId: 'prod-1',
      quantity: 10,
      status: 'Received',
      orderDate: '2026-08-25',
      expectedDelivery: '2026-08-30'
    },
    {
      id: 'PO-2026-005',
      supplierId: 'sup-3',
      productId: 'prod-3',
      quantity: 8,
      status: 'Received',
      orderDate: '2026-08-28',
      expectedDelivery: '2026-09-04'
    },
    {
      id: 'PO-2026-006',
      supplierId: 'sup-5',
      productId: 'prod-5',
      quantity: 20,
      status: 'Received',
      orderDate: '2026-09-01',
      expectedDelivery: '2026-09-05'
    },
    {
      id: 'PO-2026-007',
      supplierId: 'sup-6',
      productId: 'prod-8',
      quantity: 6,
      status: 'In Transit',
      orderDate: '2026-09-14',
      expectedDelivery: '2026-09-22'
    },
    {
      id: 'PO-2026-008',
      supplierId: 'sup-3',
      productId: 'prod-11',
      quantity: 25,
      status: 'Ordered',
      orderDate: '2026-09-15',
      expectedDelivery: '2026-09-22'
    },
    {
      id: 'PO-2026-009',
      supplierId: 'sup-1',
      productId: 'prod-6',
      quantity: 10,
      status: 'Received',
      orderDate: '2026-09-02',
      expectedDelivery: '2026-09-07'
    },
    {
      id: 'PO-2026-010',
      supplierId: 'sup-4',
      productId: 'prod-10',
      quantity: 6,
      status: 'In Transit',
      orderDate: '2026-09-13',
      expectedDelivery: '2026-09-27'
    }
  ],
  stockMovements: [
    {
      id: 'mov-1',
      productId: 'prod-1',
      type: 'Received',
      quantity: 10,
      timestamp: '2026-08-30T10:20:00Z',
      note: 'PO-2026-004 delivered from Apex Global Computing'
    },
    {
      id: 'mov-2',
      productId: 'prod-1',
      type: 'Sold',
      quantity: 2,
      timestamp: '2026-09-03T14:15:00Z',
      note: 'Dispatched 2 units for Horizon Medical pilot setup'
    },
    {
      id: 'mov-3',
      productId: 'prod-3',
      type: 'Received',
      quantity: 8,
      timestamp: '2026-09-04T11:45:00Z',
      note: 'PO-2026-005 received at central warehouse'
    },
    {
      id: 'mov-4',
      productId: 'prod-5',
      type: 'Received',
      quantity: 20,
      timestamp: '2026-09-05T09:30:00Z',
      note: 'PO-2026-006 delivery inspected and verified'
    },
    {
      id: 'mov-5',
      productId: 'prod-5',
      type: 'Sold',
      quantity: 6,
      timestamp: '2026-09-06T16:00:00Z',
      note: 'Order fulfillment for Apex Logistics Hub'
    },
    {
      id: 'mov-6',
      productId: 'prod-4',
      type: 'Sold',
      quantity: 4,
      timestamp: '2026-09-07T13:10:00Z',
      note: 'Direct client delivery to GreenGrid project site'
    },
    {
      id: 'mov-7',
      productId: 'prod-6',
      type: 'Received',
      quantity: 10,
      timestamp: '2026-09-07T15:40:00Z',
      note: 'PO-2026-009 received from Apex Global Computing'
    },
    {
      id: 'mov-8',
      productId: 'prod-2',
      type: 'Sold',
      quantity: 11,
      timestamp: '2026-09-09T11:00:00Z',
      note: 'Bulk delivery for tech office campus'
    },
    {
      id: 'mov-9',
      productId: 'prod-11',
      type: 'Sold',
      quantity: 8,
      timestamp: '2026-09-11T10:30:00Z',
      note: 'Dispatched for Veloce Cloud data center floor'
    },
    {
      id: 'mov-10',
      productId: 'prod-9',
      type: 'Return',
      quantity: 1,
      timestamp: '2026-09-14T17:00:00Z',
      note: 'Returned unit from showroom client demo'
    }
  ],
  theme: 'light'
};
