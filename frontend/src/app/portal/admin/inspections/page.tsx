'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ClipboardCheck, Plus, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';

const inspectionSchema = z.object({
  extinguisherId: z.string().min(1, { message: 'Required' }),
  condition: z.enum(['Pass', 'Fail', 'NeedsMaintenance']),
  notes: z.string().optional(),
});

export default function InspectionsList() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof inspectionSchema>>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: {
      extinguisherId: '',
      condition: 'Pass',
      notes: '',
    },
  });

  const fetchInspections = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/inspections?page=${page}&limit=10`);
      setInspections(response.data.data || []);
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        totalPages: response.data.totalPages,
      });
    } catch (err: any) {
      console.error('Failed to fetch inspections', err);
      toast.error('Failed to load inspections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  async function onSubmit(values: z.infer<typeof inspectionSchema>) {
    setFormError(null);
    try {
      // In a real scenario, we'd pull the inspector ID from the current user session
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      const payload = {
        ...values,
        inspectorId: user ? user._id : 'unknown'
      };

      await api.post('/inspections', payload);
      setIsModalOpen(false);
      form.reset();
      fetchInspections(); 
      toast.success('Inspection logged successfully!');
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to log inspection');
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inspections</h1>
          <p className="text-gray-500 mt-2">View routine fire extinguisher inspections.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white border-0 shadow-md rounded-2xl p-6 flex flex-row items-center justify-start gap-5">
          <div className="bg-indigo-50 p-4 rounded-xl shrink-0">
            <ClipboardCheck className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Total Inspections</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{pagination.total}</h3>
          </div>
        </Card>
        
        <Card className="bg-white border-0 shadow-md rounded-2xl p-6 flex flex-row items-center justify-start gap-5">
          <div className="bg-green-50 p-4 rounded-xl shrink-0">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Passed Recently</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{inspections.filter(i => i.condition === 'Pass').length}</h3>
          </div>
        </Card>

        <Card className="bg-white border-0 shadow-md rounded-2xl p-6 flex flex-row items-center justify-start gap-5">
          <div className="bg-rose-50 p-4 rounded-xl shrink-0">
            <AlertTriangle className="w-8 h-8 text-rose-600" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Failed / Maintenance</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{inspections.filter(i => i.condition !== 'Pass').length}</h3>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-pulse flex flex-col items-center"><ClipboardCheck className="w-12 h-12 text-gray-300 mb-4" /><p className="text-gray-400 font-medium">Loading inspections...</p></div></div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-900">Date</TableHead>
                  <TableHead className="font-semibold text-gray-900">Extinguisher</TableHead>
                  <TableHead className="font-semibold text-gray-900">Inspector</TableHead>
                  <TableHead className="font-semibold text-gray-900">Condition</TableHead>
                  <TableHead className="font-semibold text-gray-900">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inspections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                      No inspections logged yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  inspections.map((insp) => (
                    <TableRow key={insp._id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="font-medium text-gray-900">
                        {new Date(insp.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium text-indigo-600">{insp.extinguisherId}</TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{insp.inspectorId}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          insp.condition === 'Pass' ? 'bg-green-100 text-green-700' : 
                          insp.condition === 'Fail' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {insp.condition === 'NeedsMaintenance' ? 'Maintenance' : insp.condition}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 max-w-xs truncate">
                        {insp.notes || '-'}
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
                    onClick={() => fetchInspections(pagination.page - 1)}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchInspections(pagination.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
