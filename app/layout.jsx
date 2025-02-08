import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ConfigProvider } from 'antd';
import { NotificationProvider } from "./provider"

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: 'ekin',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={jakarta.className}>
        <NotificationProvider>
          <ConfigProvider
            theme={{
              token: {
                fontFamily: jakarta,
                colorPrimary: '#5e9ea0',
                colorInfo: '#51AEFF',
                colorSuccess: '#90B522',
                colorWarning: '#FCA235',
                colorError: '#FF6D70',
              },

            }}
          >
            {children}
          </ConfigProvider>
        </NotificationProvider>


      </body>
    </html>
  );
}
