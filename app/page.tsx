import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to Polish version for root path
  redirect('/pl');
}
