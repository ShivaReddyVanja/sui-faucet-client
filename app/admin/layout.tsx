import "./../globals.css"

import { SidebarNav } from './components/sidebar-nav';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-100 w-full">
        <SidebarNav />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
