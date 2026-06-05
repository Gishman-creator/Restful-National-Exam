'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ShieldAlert, User as UserIcon, ArrowLeft, Hash, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UserDetailsPage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [extinguishers, setExtinguishers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, extRes] = await Promise.all([
          api.get(`/users/${params.userId}`),
          api.get('/extinguishers?limit=100') // fetch all to filter client side since we don't have assignedTo query built in yet
        ]);
        
        setUser(userRes.data);
        
        const userEmail = userRes.data.email;
        const userId = userRes.data.id;
        
        const assigned = (extRes.data.data || []).filter(
          (e: any) => e.assignedTo === userId || e.assignedTo === userEmail
        );
        setExtinguishers(assigned);

      } catch (err) {
        console.error('Failed to fetch data', err);
        toast.error('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.userId]);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <Button variant="ghost" className="mb-4 text-gray-500 hover:text-gray-900 pl-0 gap-2" onClick={() => router.push('/portal/admin/users')}>
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </Button>
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 p-4 rounded-full">
            <UserIcon className="w-8 h-8 text-indigo-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {loading ? 'Loading...' : `${user?.firstName} ${user?.lastName}`}
            </h1>
            <p className="text-gray-500 mt-1">{loading ? '' : user?.email}</p>
          </div>
        </div>
      </div>

      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border-0 shadow-md rounded-2xl p-6 flex flex-row items-center justify-start gap-5">
              <div className="bg-indigo-50 p-4 rounded-xl shrink-0">
                <ShieldAlert className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">Assigned Extinguishers</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{extinguishers.length}</h3>
              </div>
            </Card>
            
            <Card className="bg-white border-0 shadow-md rounded-2xl p-6 flex flex-row items-center justify-start gap-5">
              <div className="bg-green-50 p-4 rounded-xl shrink-0">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">Active Status</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{extinguishers.filter(e => e.status === 'Active').length}</h3>
              </div>
            </Card>

            <Card className="bg-white border-0 shadow-md rounded-2xl p-6 flex flex-row items-center justify-start gap-5">
              <div className="bg-rose-50 p-4 rounded-xl shrink-0">
                <AlertTriangle className="w-8 h-8 text-rose-600" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">Needs Maintenance</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{extinguishers.filter(e => e.status !== 'Active').length}</h3>
              </div>
            </Card>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Extinguisher Registry</h2>
                <p className="text-sm text-gray-500">Read-only view of units assigned to this user.</p>
              </div>
            </div>
            
            <Table>
              <TableHeader className="bg-white">
                <TableRow>
                  <TableHead className="font-semibold text-gray-900">Serial #</TableHead>
                  <TableHead className="font-semibold text-gray-900">Location</TableHead>
                  <TableHead className="font-semibold text-gray-900">Type & Size</TableHead>
                  <TableHead className="font-semibold text-gray-900">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {extinguishers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                      No extinguishers assigned to this user.
                    </TableCell>
                  </TableRow>
                ) : (
                  extinguishers.map((ext) => (
                    <TableRow key={ext._id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="font-medium text-gray-900">{ext.serialNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-3 h-3 mr-1.5 text-gray-400" />
                          {ext.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900">{ext.type}</span>
                          <span className="text-xs text-gray-500">{ext.size}</span>
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
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
