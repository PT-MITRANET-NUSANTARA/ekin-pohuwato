import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ConfigProvider } from 'antd';

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
        <ConfigProvider
          theme={{
            token: {
              fontFamily: jakarta
            },
          }}
        >

        {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
