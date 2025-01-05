import './globals.css';
import ThemeRegistry from '../components/ThemeRegistry';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Event Photo Share',
  description: 'Share photos from your special events',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <Navbar />
          <main>{children}</main>
        </ThemeRegistry>
      </body>
    </html>
  );
}
