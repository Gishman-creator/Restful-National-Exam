'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Users as UsersIcon, ShieldAlert, User as UserIcon, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';

export default function AdminUsersList() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [roleFilter, setRoleFilter] = useState('All');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/users/${userId}/status`, {
        isActive: !currentStatus
      });
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const filteredUsers = users.filter(u => roleFilter === 'All' || u.role === roleFilter);

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-2">View all registered users and manage their access.</p>
        </div>
        
        <div className="w-full sm:w-48">
          <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val || 'All')}>
            <SelectTrigger className="w-full bg-white h-12">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Inspector">Inspector</SelectItem>
              <SelectItem value="User">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white border-0 shadow-md rounded-2xl p-6 flex flex-row items-center justify-start gap-5">
          <div className="bg-indigo-50 p-4 rounded-xl shrink-0">
            <UsersIcon className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{users.length}</h3>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-pulse"><UsersIcon className="w-12 h-12 text-gray-300" /></div></div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="font-semibold text-gray-900">Name</TableHead>
                <TableHead className="font-semibold text-gray-900">Email</TableHead>
                <TableHead className="font-semibold text-gray-900">Role</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    No users found matching the filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((u) => (
                  <TableRow 
                    key={u.id} 
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full"><UserIcon className="w-4 h-4 text-gray-500" /></div>
                        {u.firstName} {u.lastName}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{u.email}</TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        u.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 
                        u.role === 'Inspector' ? 'bg-amber-100 text-amber-700' : 
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {u.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      {u.isActive !== false ? (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Active</span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Deactivated</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white rounded-xl shadow-lg border border-gray-100">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {u.role === 'User' && (
                              <DropdownMenuItem onClick={() => router.push(`/portal/admin/users/${u.id}`)}>
                                View Extinguishers
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {u.role !== 'Admin' && (
                              <DropdownMenuItem 
                                onClick={() => toggleUserStatus(u.id, u.isActive !== false)}
                                className={u.isActive !== false ? 'text-red-600 focus:text-red-700 focus:bg-red-50' : 'text-green-600 focus:text-green-700 focus:bg-green-50'}
                              >
                                {u.isActive !== false ? 'Deactivate User' : 'Activate User'}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
}
