import { publicAction } from '@/lib/tovernet/api';
import { authClient } from '@/lib/tovernet/supabase';
import { disablePush, enablePush } from '@/lib/tovernet/push';
import type { DocRow, Overview, PanelApi, PaymentOrder, ProjectApi, Workspace } from './types';

/** The live panel API: public-api actions under the signed-in user's token. */
export function liveApi(tokenOf: () => string): PanelApi {
  const project = (projectId: string): ProjectApi => {
    const call = <T,>(action: string, payload: Record<string, unknown> = {}) =>
      publicAction<T>(action, { projectId, ...payload }, tokenOf());
    const get = async () => (await call<{ project: Workspace }>('tovernetProject.get')).project;
    return {
      get,
      saveBrief: async (answers, submit) => (await call<{ project: Workspace }>('tovernetProject.saveBrief', { answers, submit })).project,
      post: async (kind, body) => (await call<{ project: Workspace }>('tovernetProject.post', { kind, body })).project,
      review: async (decision, body) => (await call<{ project: Workspace }>('tovernetProject.review', { decision, body })).project,
      upload: async (file, purpose) => {
        const supabase = authClient();
        if (!supabase) throw new Error('upload_failed');
        const r = await call<{ fileId: string; bucket: string; path: string; token: string }>('tovernetProject.upload', {
          fileName: file.name, mimeType: mimeOf(file), size: file.size, purpose,
        });
        const { error } = await supabase.storage.from(r.bucket).uploadToSignedUrl(r.path, r.token, file, { contentType: mimeOf(file) });
        if (error) throw new Error('upload_failed');
        await call('tovernetProject.fileDone', { fileId: r.fileId });
      },
      fileUrl: async (fileId) => {
        const r = await call<{ path: string }>('tovernetProject.fileUrl', { fileId });
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''}${r.path}`;
      },
      fileRemove: async (fileId) => { await call('tovernetProject.fileRemove', { fileId }); },
      markRead: async () => { try { await call('tovernetProject.markRead'); } catch { /* older backend: local memory only */ } },
    };
  };

  return {
    overview: async () => (await publicAction<{ overview: Overview }>('tovernetPanel.overview', {}, tokenOf())).overview,
    documents: async () => (await publicAction<{ documents: DocRow[] }>('tovernetPanel.documents', {}, tokenOf())).documents ?? [],
    portal: async () => (await publicAction<{ url: string }>('tovernetBilling.portal', {}, tokenOf())).url,
    project,
    push: { enable: () => enablePush(tokenOf()), disable: () => disablePush(tokenOf()) },
    billing: {
      payments: async () => (await publicAction<{ orders: PaymentOrder[] }>('tovernetPanel.payments', {}, tokenOf())).orders ?? [],
      payoff: (orderId) => publicAction('tovernetPay.payoff', { orderId }, tokenOf()),
      confirm: (paymentIntentId) => publicAction('tovernetPay.confirm', { paymentIntentId }),
      autopaySetup: (orderId) => publicAction('tovernetPay.autopaySetup', { orderId }, tokenOf()),
      autopayConfirm: (setupIntentId) => publicAction('tovernetPay.autopayConfirm', { setupIntentId }, tokenOf()),
      autopayOff: async (orderId) => { await publicAction('tovernetPay.autopayOff', { orderId }, tokenOf()); },
      planCancel: async (orderId) => { await publicAction('tovernetPay.planCancel', { orderId }, tokenOf()); },
    },
  };
}

// Phones often report HEIC with an empty type; the server accepts only known types.
export function mimeOf(file: File): string {
  if (file.type) return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase();
  return ({ heic: 'image/heic', heif: 'image/heif', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', svg: 'image/svg+xml', pdf: 'application/pdf' } as Record<string, string>)[ext ?? ''] ?? 'application/octet-stream';
}
