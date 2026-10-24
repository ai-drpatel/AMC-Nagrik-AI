import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AMC Nagrik AI - Civic Complaint Agent | Garbathon GDG Ahmedabad',
  description: 'Multimodal AI Civic Complaint Dispatch & Citizen Helpline for Ahmedabad Municipal Corporation (AMC)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
