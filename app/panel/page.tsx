import type { Metadata } from 'next';
import PanelClient from '@/components/tovernet/PanelClient';

export const metadata: Metadata = {
  title: 'Panel klienta | Tovernet',
  robots: { index: false, follow: false, nocache: true },
  // Home-screen web app: on iPhone, push works only from there (iOS 16.4+).
  manifest: '/panel.webmanifest',
  appleWebApp: { capable: true, title: 'Tovernet', statusBarStyle: 'default' },
  icons: { apple: '/embed/tovernet-logo.png' },
};

export default function PanelPage() {
  return <PanelClient />;
}
