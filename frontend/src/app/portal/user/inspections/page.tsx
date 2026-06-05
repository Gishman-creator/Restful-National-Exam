'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CalendarClock, CheckCircle, Clock, FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';

export default function UserInspectionsList() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      // 1. Fetch all extinguishers
      const extResponse = await api.get(`/extinguishers?limit=1000`);
      // Filter for current user
      const userExtinguishers = (extResponse.data.data || []).filter(
        (ext: any) => ext.assignedTo === user?.email || ext.assignedTo === user?.id
      );
      const userSerialNumbers = userExtinguishers.map((e: any) => e.serialNumber);

      // 2. Fetch inspections
      const inspResponse = await api.get(`/inspections?limit=1000`);
      // Filter inspections matching user's extinguishers
      const userInspections = (inspResponse.data.data || []).filter((insp: any) => 
        userSerialNumbers.includes(insp.extinguisherId)
      );
      
      setInspections(userInspections);
    } catch (err: any) {
      console.error('Failed to fetch inspections', err);
      toast.error('Failed to load inspections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const scheduledCount = inspections.filter(i => i.status === 'Scheduled').length;
  const completedCount = inspections.filter(i => i.status === 'Completed').length;
  const totalCount = inspections.length;

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Inspections</h1>
          <p className="text-gray-500 mt-2">View scheduled and completed inspections for your extinguishers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white border-0 shadow-md rounded-2xl p-6 flex flex-row items-center justify-start gap-5">
          <div className="bg-indigo-50 p-4 rounded-xl shrink-0">
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Total Inspections</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalCount}</h3>
          </div>
        </Card>
        
        <Card className="bg-white border-0 shadow-md rounded-2xl p-6 flex flex-row items-center justify-start gap-5">
          <div className="bg-amber-50 p-4 rounded-xl shrink-0">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Scheduled / Pending</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{scheduledCount}</h3>
          </div>
        </Card>

        <Card className="bg-white border-0 shadow-md rounded-2xl p-6 flex flex-row items-center justify-start gap-5">
          <div className="bg-green-50 p-4 rounded-xl shrink-0">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Completed</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{completedCount}</h3>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-pulse flex flex-col items-center"><CalendarClock className="w-12 h-12 text-gray-300 mb-4" /><p className="text-gray-400 font-medium">Loading inspections...</p></div></div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="font-semibold text-gray-900">Date</TableHead>
                <TableHead className="font-semibold text-gray-900">Extinguisher</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-semibold text-gray-900">Condition</TableHead>
                <TableHead className="font-semibold text-gray-900">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    No inspections scheduled or completed for your extinguishers yet.
                  </TableCell>
                </TableRow>
              ) : (
                inspections.map((insp) => (
                  <TableRow key={insp._id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium text-gray-900">
                      {insp.status === 'Scheduled' && insp.scheduledDate
                        ? new Date(insp.scheduledDate).toLocaleDateString()
                        : new Date(insp.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium text-indigo-600">{insp.extinguisherId}</TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        insp.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {insp.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {insp.status === 'Completed' && insp.condition ? (
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          insp.condition === 'Pass' ? 'bg-green-100 text-green-700' : 
                          insp.condition === 'Fail' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {insp.condition === 'NeedsMaintenance' ? 'Maintenance' : insp.condition}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 max-w-xs truncate">
                      {insp.notes || '-'}
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
