import './globals.css';
import TopNav from '@/components/TopNav';

export const metadata = {
  title: 'AVFU ID Card Generator',
  description: 'Generate and manage identity cards for Assam Veterinary and Fishery University',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
