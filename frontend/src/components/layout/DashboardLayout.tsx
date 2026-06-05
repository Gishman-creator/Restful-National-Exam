'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FlameKindling, LogOut, Settings, User as UserIcon, Menu, LayoutDashboard, ShieldAlert, Users, FileText, BarChart } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  const NavLinks = () => (
    <div className="flex flex-col gap-2 p-4">
      <Link href={`/portal/${user.role.toLowerCase()}`} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === `/portal/${user.role.toLowerCase()}` ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
        <LayoutDashboard className="w-5 h-5" />
        Dashboard
      </Link>

      <Link href={`/portal/${user.role.toLowerCase()}/inspections`} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname.includes('inspections') ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
        <FileText className="w-5 h-5" />
        Inspections
      </Link>
      {user.role === 'Inspector' && (
        <Link href={`/portal/${user.role.toLowerCase()}/logs`} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname.includes('logs') ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
          <BarChart className="w-5 h-5" />
          Recent Activities
        </Link>
      )}
      {user.role === 'Admin' && (
        <>
          <Link href={`/portal/${user.role.toLowerCase()}/reports`} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname.includes('reports') ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
            <BarChart className="w-5 h-5" />
            Reports
          </Link>
          <Link href={`/portal/${user.role.toLowerCase()}/users`} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname.includes('users') ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Users className="w-5 h-5" />
            Users
          </Link>
          <Link href={`/portal/${user.role.toLowerCase()}/logs`} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname.includes('logs') ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
            <FileText className="w-5 h-5" />
            Recent Activities
          </Link>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F8F9FB]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 bg-white fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 cursor-pointer" onClick={() => router.push(`/portal/${user.role.toLowerCase()}`)}>
          <div className="bg-indigo-600 p-1.5 rounded-lg mr-2">
            <FlameKindling className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">TZW FEMS</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavLinks />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            {/* Mobile Sidebar Trigger */}
            <Sheet>
              <SheetTrigger className="md:hidden p-2 -ml-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Menu className="w-6 h-6" />
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 bg-white border-r-0">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                  <div className="bg-indigo-600 p-1.5 rounded-lg mr-2">
                    <FlameKindling className="text-white w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold text-gray-900 tracking-tight">TZW FEMS</span>
                </div>
                <NavLinks />
              </SheetContent>
            </Sheet>
            
            {/* Mobile Branding (visible only on mobile) */}
            <div className="md:hidden flex items-center gap-2 cursor-pointer" onClick={() => router.push(`/portal/${user.role.toLowerCase()}`)}>
              <span className="text-lg font-bold text-gray-900 tracking-tight">TZW FEMS</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger render={<button className="outline-none ring-0 flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors cursor-pointer" />}>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-500 leading-tight">{user.role}</p>
                </div>
                <Avatar className="h-10 w-10 border-2 border-indigo-100 shadow-sm">
                  <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer py-2">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer py-2">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer py-2 text-red-600 focus:bg-red-50 focus:text-red-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
