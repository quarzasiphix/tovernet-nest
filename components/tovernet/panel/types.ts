// Shapes returned by public-api `tovernetPanel.*` and `tovernetProject.*` (ksiegai
// migrations 20261101220000, 20261102150000, 20261103120000). The panel only reads
// these; the database decides access and every state change.

import type { PanelCompanyData } from '../PanelCompany';

export type { PanelCompanyData };

export type OrderItem = { name: string; quantity: number; billing_interval: string | null; unit_amount_minor: number };
export type Subscription = { status: string; current_period_end: string | null; cancel_at_period_end: boolean };
export type Order = {
  id: string;
  status: string;
  created_at?: string;
  paid_at?: string | null;
  lead_id?: string | null;
  public_id?: string | null;
  company_name: string;
  total_gross_minor: number;
  recurring_gross_minor: number;
  requires_review: boolean;
  invoice_number: string | null;
  items: OrderItem[] | null;
  subscription: Subscription | null;
};
export type ProjectSummary = {
  id: string;
  name: string;
  status: string;
  company_name: string;
  preview_url: string | null;
  production_url: string | null;
  domain: string | null;
  open_requests: number;
  lead_id: string | null;
  order_id: string;
  created_at?: string;
};
export type Offer = { company_name: string; public_id: string | null; status: string };
export type Overview = { companies?: PanelCompanyData[]; projects: ProjectSummary[]; offers: Offer[]; orders: Order[] };

export type Item = { id: string; kind: string; author_side: 'client' | 'staff'; body: string; status: string; created_at: string };
export type FileRow = { id: string; file_name: string; mime_type: string; size_bytes: number; purpose: 'photo' | 'logo' | 'document' | string; created_at: string };
export type Brief = {
  phone?: string; email?: string; area?: string; services?: string[];
  no_photos?: boolean; no_logo?: boolean; domain_choice?: 'have' | 'new' | 'unsure'; domain?: string; notes?: string;
};
export type Workspace = {
  id: string; name: string; status: string; domain: string | null; preview_url: string | null; production_url?: string | null;
  created_at?: string;
  brief: Brief; brief_submitted_at: string | null;
  revision_rounds_used: number; revision_rounds_limit: number; approved_at: string | null;
  package: { key: string; name: string; limits: Record<string, number> } | null;
  plan: { key: string; name: string } | null;
  prefill: {
    company_name: string | null; legal_name?: string | null; nip?: string | null; krs?: string | null;
    email: string | null; city: string | null; address?: string | null; website: string | null; variant: string | null;
  };
  items: Item[]; files: FileRow[];
  /** Optional, from the Księgai integration (session p-69). Server status wins over the fallback. */
  ksiegai?: KsiegaiLink | null;
  /** Optional: client-visible events, newest order not guaranteed. */
  timeline?: { type: string; at: string; label: string }[] | null;
  /** Optional: staff items since the client's last read (server side). */
  unread?: number | null;
};

export type KsiegaiLink = {
  status: 'waiting' | 'preparing' | 'ready' | 'failed';
  business_profile_id?: string | null;
  ready_at?: string | null;
  missing?: string[] | null;
};

export type DocRow = {
  order_id: string;
  order_number: string;
  company: string;
  accepted_at: string;
  signatory: string;
  authority_status: string;
  work_not_before: string | null;
  protected_buyer: boolean;
  spec_sha256: string | null;
  documents: { key: string; title: string; version: string; pdf: string | null; sha256: string }[] | null;
};

/** Everything the panel asks the server. Live: public-api through the gateway. Preview: fixtures. */
export type PanelApi = {
  overview(): Promise<Overview>;
  documents(): Promise<DocRow[]>;
  portal(): Promise<string>;
  project(projectId: string): ProjectApi;
  /** Scheduled billing (instalments, plan, autopay); absent in older fixtures. */
  billing?: BillingApi;
  /** Browser notifications for this device; absent in previews and fixtures. */
  push?: PushApi;
};

export type PushApi = {
  enable(): Promise<{ ok: boolean; reason?: 'unsupported' | 'denied' | 'error' }>;
  disable(): Promise<void>;
};

/** ksiegai docs/plans/tovernet/19-instalments.md §6. */
export type PaymentCharge = {
  id: string; seq: number; kind?: 'instalment' | 'plan' | 'payoff'; label: string; amount_minor: number; due_date: string;
  status: 'scheduled' | 'invoiced' | 'paid' | 'superseded'; share_slug: string | null; invoice_number: string | null; paid_at: string | null;
};
export type PaymentOrder = {
  order_id: string; created_at: string; company: string; payment_option: 'full' | 'instalments'; paid_at: string | null;
  first_payment_minor: number; method: string | null; first_invoice_number: string | null;
  website: null | { name: string; status: 'active' | 'completed' | 'cancelled' | 'review'; total_minor: number; paid_minor: number;
    remaining_minor: number; count: number; autopay: string | null; charges: PaymentCharge[] | null };
  plan: null | { name: string; status: 'pending_start' | 'active' | 'completed' | 'cancelled' | 'review'; amount_minor: number;
    billing_day: number; autopay: string | null; charges: PaymentCharge[] | null };
  overdue: { id: string; label: string; amount_minor: number; due_date: string; share_slug: string }[];
};
export type BillingApi = {
  payments(): Promise<PaymentOrder[]>;
  payoff(orderId: string): Promise<{ clientSecret: string; amountMinor: number; count: number }>;
  confirm(paymentIntentId: string): Promise<{ paymentStatus: string; error: string | null }>;
  autopaySetup(orderId: string): Promise<{ clientSecret: string }>;
  autopayConfirm(setupIntentId: string): Promise<{ status: string; label: string | null }>;
  autopayOff(orderId: string): Promise<void>;
  planCancel(orderId: string): Promise<void>;
};

export type ProjectApi = {
  get(): Promise<Workspace>;
  saveBrief(answers: Brief, submit: boolean): Promise<Workspace>;
  post(kind: 'message' | 'change_request', body: string): Promise<Workspace>;
  review(decision: 'approve' | 'revise', body: string | null): Promise<Workspace>;
  upload(file: File, purpose: 'photo' | 'logo' | 'document'): Promise<void>;
  fileUrl(fileId: string): Promise<string>;
  fileRemove(fileId: string): Promise<void>;
  /** Marks staff messages as read on the server. Tolerates a backend without the action. */
  markRead(): Promise<void>;
};
