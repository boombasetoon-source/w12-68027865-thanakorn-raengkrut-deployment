import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';

import { Noto_Sans_Thai } from 'next/font/google';
import AppHeader from '@/components/AppHeader';
import AppNavbar from '@/components/AppNavbar';
import AppFooter from '@/components/AppFooter';
import AppProvider from '@/components/AppProvider';
import AppShell from '@/components/AppShell';
import UserBar from '@/components/UserBar';

const thaiFont = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  variable: '--font-thai',
});

export const metadata = {
  title: {
    default: 'CSI205 Front-End Software Development',
    template: '%s | CSI205',
  },
  description: 'งานวิชา CSI205: Home, Animation, Calculator, Todos, Products และ Carts ด้วย Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={thaiFont.variable}>
        <AppProvider>
          <AppShell>
            <AppHeader />
            <UserBar />
            <AppNavbar />
            <main>{children}</main>
            <AppFooter />
          </AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
