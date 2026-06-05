'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Users, FileText, MapPin, Hash, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from 'next/navigation';

export default function AdminPortal() {
  const router = useRouter();
  const [extinguishers, setExtinguishers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 5, total: 0, totalPages: 1 });

  const fetchExtinguishers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/extinguishers?page=${page}&limit=5`);
      setExtinguishers(response.data.data || []);
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        totalPages: response.data.totalPages,
      });
    } catch (err: any) {
      console.error('Failed to fetch extinguishers', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExtinguishers();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Overview of the entire TZW FEMS platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="bg-white border-0 shadow-md rounded-2xl p-6 flex flex-row items-center justify-start gap-5">
          <div className="bg-indigo-50 p-4 rounded-xl shrink-0">
            <Users className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">42</h3>
          </div>
        </Card>
        
        <Card className="bg-white border-0 shadow-md rounded-2xl p-6 flex flex-row items-center justify-start gap-5">
          <div className="bg-rose-50 p-4 rounded-xl shrink-0">
            <ShieldAlert className="w-8 h-8 text-rose-600" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Registered Extinguishers</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{pagination.total}</h3>
          </div>
        </Card>

        <Card className="bg-white border-0 shadow-md rounded-2xl p-6 flex flex-row items-center justify-start gap-5">
          <div className="bg-amber-50 p-4 rounded-xl shrink-0">
            <FileText className="w-8 h-8 text-amber-600" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Pending Inspections</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">12</h3>
          </div>
        </Card>
      </div>

      {/* Quick Actions & Recent */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Table Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Extinguisher Registry Overview</h2>
              <p className="text-sm text-gray-500">Latest registered extinguishers.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push('/portal/admin/extinguishers')} className="gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20"><div className="animate-pulse"><ShieldAlert className="w-8 h-8 text-gray-300" /></div></div>
          ) : (
            <>
              <Table>
                <TableHeader className="bg-white">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-900">Serial #</TableHead>
                    <TableHead className="font-semibold text-gray-900">Type</TableHead>
                    <TableHead className="font-semibold text-gray-900">Assigned To</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {extinguishers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                        No extinguishers available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    extinguishers.map((ext) => (
                      <TableRow key={ext._id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="font-medium text-gray-900">{ext.serialNumber}</TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{ext.type}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-600">
                            <Hash className="w-3 h-3 mr-1.5 text-gray-400" />
                            {ext.assignedTo || 'Unassigned'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${ext.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {ext.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    Showing page {pagination.page} of {pagination.totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={pagination.page <= 1}
                      onClick={() => fetchExtinguishers(pagination.page - 1)}
                    >
                      Prev
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => fetchExtinguishers(pagination.page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
