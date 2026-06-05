'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';


import { ScheduleInspectionModal, scheduleSchema } from '@/app/portal/user/components/dashboard/ScheduleInspectionModal';
import { AddExtinguisherModal, extSchema } from '@/app/portal/user/components/dashboard/AddExtinguisherModal';
import { Calendar as CalendarIcon, ShieldAlert, Hash, Plus, Trash2, Edit2, CheckCircle, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';



export default function UserPortal() {
  const [extinguishers, setExtinguishers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isExtModalOpen, setIsExtModalOpen] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);
  const [extFormError, setExtFormError] = useState<string | null>(null);

  const [editingExtId, setEditingExtId] = useState<string | null>(null);

  const scheduleForm = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      extinguisherId: '',
      scheduledDate: undefined,
      personnelNotified: false,
    },
  });

  const extForm = useForm<z.infer<typeof extSchema>>({
    resolver: zodResolver(extSchema),
    defaultValues: {
      serialNumber: '',
      type: 'Water',
      size: '2.5 lbs.',
      location: '',
    },
  });

  const fetchAssignedExtinguishers = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const response = await api.get(`/extinguishers?limit=100`);
      // Filter locally for now, assuming api doesn't have assignedTo filter
      const userExtinguishers = (response.data.data || []).filter((ext: any) => ext.assignedTo === user?.email || ext.assignedTo === user?.id);
      setExtinguishers(userExtinguishers);
    } catch (err: any) {
      console.error('Failed to fetch extinguishers', err);
      toast.error('Failed to load extinguishers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedExtinguishers();
  }, []);

  async function onScheduleSubmit(values: z.infer<typeof scheduleSchema>) {
    setFormError(null);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const payload = {
        ...values,
        userId: user ? user.id : 'unknown'
      };

      await api.post('/inspections/schedule', payload);
      setIsScheduleModalOpen(false);
      scheduleForm.reset();
      toast.success('Inspection scheduled successfully!');
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to schedule inspection');
    }
  }

  async function onExtSubmit(values: z.infer<typeof extSchema>) {
    setExtFormError(null);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const payload = {
        ...values,
        assignedTo: user ? user.id : 'unknown'
      };

      if (editingExtId) {
        const { serialNumber, ...updatePayload } = payload;
        await api.put(`/extinguishers/${editingExtId}`, updatePayload);
        toast.success('Extinguisher updated successfully!');
      } else {
        await api.post('/extinguishers', payload);
        toast.success('Extinguisher registered successfully!');
      }

      setIsExtModalOpen(false);
      extForm.reset();
      setEditingExtId(null);
      fetchAssignedExtinguishers();
    } catch (err: any) {
      setExtFormError(err.response?.data?.message || 'Failed to save extinguisher');
    }
  }

  const handleDeleteExt = async (id: string) => {
    if (!confirm('Are you sure you want to delete this extinguisher?')) return;
    try {
      await api.delete(`/extinguishers/${id}`);
      toast.success('Extinguisher deleted');
      fetchAssignedExtinguishers();
    } catch (err) {
      toast.error('Failed to delete extinguisher');
    }
  };

  const handleEditExt = (ext: any) => {
    setEditingExtId(ext._id);
    extForm.reset({
      serialNumber: ext.serialNumber,
      type: ext.type,
      size: ext.size,
      location: ext.location,
      manufacturingDate: ext.manufacturingDate ? new Date(ext.manufacturingDate) : undefined,
      expirationDate: ext.expirationDate ? new Date(ext.expirationDate) : undefined,
    });
    setIsExtModalOpen(true);
  };

  const handleOpenNewExtModal = () => {
    setEditingExtId(null);
    extForm.reset({
      serialNumber: '',
      type: 'Water',
      size: '2.5 lbs.',
      location: '',
      manufacturingDate: undefined,
      expirationDate: undefined,
    });
    setIsExtModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">User Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage your assigned fire extinguishers and schedule inspections.</p>
        </div>

        <div className="flex gap-2">
          {/* Schedule Inspection Modal */}
          <ScheduleInspectionModal
            isOpen={isScheduleModalOpen}
            setIsOpen={setIsScheduleModalOpen}
            onSubmit={onScheduleSubmit}
            formError={formError}
            form={scheduleForm}
            extinguishers={extinguishers}
          />

          {/* Add Extinguisher Modal */}
          <AddExtinguisherModal
            isOpen={isExtModalOpen}
            setIsOpen={setIsExtModalOpen}
            onSubmit={onExtSubmit}
            formError={extFormError}
            editingExtId={editingExtId}
            form={extForm}
            onOpenNew={handleOpenNewExtModal}
          />
        </div>
      </div>

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
            <h2 className="text-lg font-bold text-gray-900">My Assigned Extinguishers</h2>
            <p className="text-sm text-gray-500">View and manage your assigned units.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-pulse"><ShieldAlert className="w-8 h-8 text-gray-300" /></div></div>
        ) : (
          <Table>
            <TableHeader className="bg-white">
              <TableRow>
                <TableHead className="font-semibold text-gray-900">Serial #</TableHead>
                <TableHead className="font-semibold text-gray-900">Location</TableHead>
                <TableHead className="font-semibold text-gray-900">Type & Size</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {extinguishers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    No extinguishers assigned to you. Click 'Add Extinguisher' to register one.
                  </TableCell>
                </TableRow>
              ) : (
                extinguishers.map((ext) => (
                  <TableRow key={ext._id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium text-gray-900">{ext.serialNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Hash className="w-3 h-3 mr-1.5 text-gray-400" />
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditExt(ext)}>
                          <Edit2 className="w-4 h-4 text-gray-500 hover:text-indigo-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteExt(ext._id)}>
                          <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                        </Button>
                      </div>
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
