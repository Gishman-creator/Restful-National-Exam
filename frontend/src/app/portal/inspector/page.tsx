'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { AnswerInspectionModal, answerSchema } from '@/app/portal/inspector/components/AnswerInspectionModal';

import { ShieldAlert, Clock, CheckCircle, ClipboardCheck, ArrowRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';

export default function InspectorPortal() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [answeringInspection, setAnsweringInspection] = useState<any>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const answerForm = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      condition: 'Pass',
      notes: '',
    },
  });

  const fetchInspections = async () => {
    try {
      setLoading(true);
      // Fetch all inspections (in a real app we might fetch only assigned or all pending if inspector can see all)
      const response = await api.get(`/inspections?limit=100`);
      setInspections(response.data.data || []);
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

  const handleOpenAnswerModal = (inspection: any) => {
    setAnsweringInspection(inspection);
    answerForm.reset({
      condition: 'Pass',
      notes: '',
    });
    setIsAnswerModalOpen(true);
  };

  async function onAnswerSubmit(values: z.infer<typeof answerSchema>) {
    if (!answeringInspection) return;
    setFormError(null);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const payload = {
        ...values,
        inspectorId: user ? user._id || user.id : 'unknown'
      };

      await api.put(`/inspections/${answeringInspection._id}/answer`, payload);
      
      setIsAnswerModalOpen(false);
      setAnsweringInspection(null);
      answerForm.reset();
      fetchInspections();
      toast.success('Inspection completed successfully!');
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to complete inspection');
    }
  }

  const pendingInspections = inspections.filter(i => i.status === 'Scheduled');
  const completedInspections = inspections.filter(i => i.status === 'Completed');

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inspector Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage and complete scheduled inspections.</p>
        </div>
        
        {/* We keep Answer modal mounted but controlled by state */}
        <AnswerInspectionModal
          isOpen={isAnswerModalOpen}
          setIsOpen={setIsAnswerModalOpen}
          onSubmit={onAnswerSubmit}
          formError={formError}
          form={answerForm}
          inspection={answeringInspection}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white border-0 shadow-md rounded-2xl p-6 flex flex-row items-center justify-start gap-5">
          <div className="bg-indigo-50 p-4 rounded-xl shrink-0">
            <ClipboardCheck className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Total Scheduled</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{inspections.length}</h3>
          </div>
        </Card>

        <Card className="bg-white border-0 shadow-md rounded-2xl p-6 flex flex-row items-center justify-start gap-5">
          <div className="bg-amber-50 p-4 rounded-xl shrink-0">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Pending Inspections</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{pendingInspections.length}</h3>
          </div>
        </Card>

        <Card className="bg-white border-0 shadow-md rounded-2xl p-6 flex flex-row items-center justify-start gap-5">
          <div className="bg-green-50 p-4 rounded-xl shrink-0">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Completed</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{completedInspections.length}</h3>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Pending Inspections</h2>
            <p className="text-sm text-gray-500">Inspections waiting to be completed.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-pulse"><ShieldAlert className="w-8 h-8 text-gray-300" /></div></div>
        ) : (
          <Table>
            <TableHeader className="bg-white">
              <TableRow>
                <TableHead className="font-semibold text-gray-900">Scheduled Date</TableHead>
                <TableHead className="font-semibold text-gray-900">Extinguisher ID</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingInspections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                    No pending inspections. Great job!
                  </TableCell>
                </TableRow>
              ) : (
                pendingInspections.map((insp) => (
                  <TableRow key={insp._id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {insp.scheduledDate ? new Date(insp.scheduledDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-indigo-600">{insp.extinguisherId}</TableCell>
                    <TableCell>
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
                        Pending
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="default" size="sm" onClick={() => handleOpenAnswerModal(insp)} className="gap-2">
                        Answer <ArrowRight className="w-4 h-4" />
                      </Button>
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
