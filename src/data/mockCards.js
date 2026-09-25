export const SAVED_SEARCHES = [
  {
    id: 'overdue-high',
    name: 'My Overdue High Priority',
    criteria: { quickFilter: 'overdue', filterState: { priority: 'High Priority' } }
  },
  {
    id: 'waiting-client',
    name: 'Waiting for Client',
    criteria: { query: 'Client' }
  },
  {
    id: 'qa-pending',
    name: 'QA Pending',
    criteria: { filterState: { list: 'Under Review' } }
  },
  {
    id: 'unassigned-urgent',
    name: 'Unassigned Urgent',
    criteria: { filterState: { priority: 'Urgent' } }
  },
]

export const QUICK_SEARCH_CHIPS = [
  'Client Approval',
  'Homepage',
  'Pricing page',
  'Mobile onboarding',
  'Acme Global'
]

export const AVAILABLE_BOARDS = [
  'Marketing Campaign',
  'Product Engineering',
  'Design & UX System',
  'Customer Success',
  'Infrastructure & Cloud'
]

export const AVAILABLE_LISTS = [
  'Published / Done',
  'In Progress',
  'Under Review',
  'Backlog',
  'QA & Verification'
]

export const AVAILABLE_MEMBERS = [
  { id: 'me', name: 'Me (Current User)', isMe: true },
  { id: 'alex', name: 'Alex Rivers', isMe: false },
  { id: 'sarah', name: 'Sarah Chen', isMe: false },
  { id: 'devon', name: 'Devon Vance', isMe: false }
]

export const AVAILABLE_LABELS = [
  'Client Facing',
  'Design & UX',
  'Marketing',
  'High Impact',
  'Frontend',
  'Backend API',
  'Bug Fix',
  'Compliance'
]

export const MOCK_CARDS = [
  {
    id: 'card-1',
    title: 'Customer success testimonial video series',
    description: '3-part interview video series spotlighting productivity gains at scale for enterprise clients.',
    board: 'Marketing Campaign',
    list: 'Published / Done',
    priority: 'Medium',
    dueDate: '2026-08-30',
    isOverdue: true,
    hasIncompleteChecklist: true,
    checklistText: '3/5 completed',
    assignedMembers: ['me', 'sarah'],
    labels: ['Marketing', 'Client Facing', 'High Impact'],
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    url: null
  },
  {
    id: 'card-2',
    title: 'Redesign pricing page tier cards & checkout flow',
    description: 'Update pricing table UI with annual toggle, feature comparison tooltips, and Stripe integration.',
    board: 'Marketing Campaign',
    list: 'In Progress',
    priority: 'High Priority',
    dueDate: '2026-09-12',
    isOverdue: true,
    hasIncompleteChecklist: true,
    checklistText: '1/4 completed',
    assignedMembers: ['me', 'alex'],
    labels: ['Design & UX', 'Frontend', 'High Impact'],
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    url: null
  },
  {
    id: 'card-3',
    title: 'Mobile onboarding walkthrough carousel & analytics',
    description: 'Build native swipeable onboarding screens with PostHog event telemetry for new user signup funnel.',
    board: 'Product Engineering',
    list: 'Under Review',
    priority: 'High Priority',
    dueDate: '2026-09-20',
    isOverdue: false,
    hasIncompleteChecklist: false,
    checklistText: '4/4 completed',
    assignedMembers: ['devon'],
    labels: ['Frontend', 'Client Facing'],
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    url: null
  },
  {
    id: 'card-4',
    title: 'Acme Global custom SSO & SAML2 login provider',
    description: 'Configure enterprise Okta & Azure AD authentication endpoint for Acme Global tenant account.',
    board: 'Infrastructure & Cloud',
    list: 'Backlog',
    priority: 'Urgent',
    dueDate: '2026-09-05',
    isOverdue: true,
    hasIncompleteChecklist: true,
    checklistText: '0/3 completed',
    assignedMembers: ['me'],
    labels: ['Backend API', 'Compliance', 'High Impact'],
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    url: null
  },
  {
    id: 'card-5',
    title: 'Client Approval workflow for custom domain SSL certificates',
    description: "Automate Let's Encrypt certificate renewal notification hooks and client dashboard approval status.",
    board: 'Infrastructure & Cloud',
    list: 'In Progress',
    priority: 'Medium',
    dueDate: '2026-09-28',
    isOverdue: false,
    hasIncompleteChecklist: true,
    checklistText: '2/4 completed',
    assignedMembers: ['alex', 'sarah'],
    labels: ['Client Facing', 'Backend API'],
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    url: null
  },
  {
    id: 'card-6',
    title: 'Fix responsive navigation bar overlap on tablet viewport',
    description: 'Resolve hamburger menu z-index layering issue when scrolling past sticky filter header.',
    board: 'Design & UX System',
    list: 'QA & Verification',
    priority: 'Bug Fix',
    dueDate: '2026-09-01',
    isOverdue: true,
    hasIncompleteChecklist: true,
    checklistText: '1/2 completed',
    assignedMembers: ['me'],
    labels: ['Bug Fix', 'Frontend', 'Design & UX'],
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    url: null
  },
]
