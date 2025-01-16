import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import Login from '@/pages/Login';
import '@/style/index.css';
import { cookies } from 'next/headers';
import Header from '@/components/UI/(All)/header';
import SideBar from '@/components/UI/(All)/SideBar';
export const metadata = {
  title: 'Hệ thống chấm điểm tự động'
}

export default async function RootLayout({ children }) {
  const token = cookies().get('token')?.value;

  const response = await fetch(`${process.env.URL}/api/CheckUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ source: 1 }),
    cache: 'no-store'
  });

  let data = null;

  if (response.ok) {
    const result = await response.json();
    if (result.air === 2) {
      data = result.data;
    }
  }

  return (
    <html lang="en">
      <body style={{ margin: 0, height: '100vh', background: 'var(--background)' }}>
        <AppRouterCacheProvider>
          {data ? (
            <>
              <Header />
              <SideBar />
              <div style={{ marginLeft: '70px' }}>{children}</div>
            </>
          ) : (
            <Login />
          )}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
