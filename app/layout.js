import './globals.css';

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
        <nav className="topnav">
          <div className="topnav-inner">
            <span className="brand">AVFU ID Card Generator</span>
            <div className="navlinks">
              <a href="/">Generate</a>
              <a href="/records">Records</a>
            </div>
          </div>
        </nav>
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
