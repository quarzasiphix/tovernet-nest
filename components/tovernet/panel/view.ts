import type { Dispatch, SetStateAction } from 'react';
import type { View } from './model';
import type { ProjectApi, Workspace } from './types';

export type Intent = { draft?: string; kind?: 'message' | 'change_request'; step?: string };
export type Go = (view: View, opts?: Intent) => void;

export type ViewProps = {
  ws: Workspace;
  api: ProjectApi;
  go: Go;
  refresh: () => Promise<void>;
  setWs: Dispatch<SetStateAction<Workspace | null>>;
  intent: Intent;
};
