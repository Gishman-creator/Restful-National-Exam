'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { BarChart, Activity, AlertTriangle, ShieldAlert, Wrench, CalendarX } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ReportsPortal() {
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<any>(null);
  const [inspections, setInspections] = useState<any>(null);
  const [expired, setExpired] = useState<any>(null);
  const [maintenance, setMaintenance] = useState<any>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const [invRes, inspRes, expRes, maintRes] = await Promise.all([
          api.get('/reports/inventory'),
          api.get('/reports/inspections'),
          api.get('/reports/expired'),
          api.get('/reports/maintenance'),
        ]);

        setInventory(invRes.data);
        setInspections(inspRes.data);
        setExpired(expRes.data);
        setMaintenance(maintRes.data);
      } catch (err) {
        console.error('Failed to fetch reports', err);
        toast.error('Failed to load reports. Make sure all services are running.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Real-Time Reports</h1>
        <p className="text-gray-500 mt-2">Live metrics across inventory, inspections, compliance, and maintenance.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-pulse"><Activity className="w-8 h-8 text-indigo-500" /></div></div>
      ) : (
        <div className="space-y-8">
          
          {/* Inventory Section */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-600" /> Inventory Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border-0 shadow-md rounded-2xl p-6">
                <p className="text-sm font-medium text-gray-500">Total Extinguishers</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{inventory?.total || 0}</h3>
              </Card>
              <Card className="bg-white border-0 shadow-md rounded-2xl p-6">
                <p className="text-sm font-medium text-gray-500">Added Today</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{inventory?.daily || 0}</h3>
              </Card>
              <Card className="bg-white border-0 shadow-md rounded-2xl p-6">
                <p className="text-sm font-medium text-gray-500">Added This Month</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{inventory?.monthly || 0}</h3>
              </Card>
              <Card className="bg-white border-0 shadow-md rounded-2xl p-6">
                <p className="text-sm font-medium text-gray-500">Added This Year</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{inventory?.yearly || 0}</h3>
              </Card>
            </div>
          </section>

          {/* Inspections & Compliance */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" /> Inspection Status
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white border-0 shadow-sm rounded-xl p-5">
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{inspections?.pending || 0}</p>
                </Card>
                <Card className="bg-white border-0 shadow-sm rounded-xl p-5">
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{inspections?.completed || 0}</p>
                </Card>
                <Card className="bg-white border-0 shadow-sm rounded-xl p-5">
                  <p className="text-sm text-gray-500">Failed / Maintenance</p>
                  <p className="text-2xl font-bold text-amber-600">{inspections?.failed || 0}</p>
                </Card>
                <Card className="bg-white border-0 shadow-sm rounded-xl p-5">
                  <p className="text-sm text-gray-500">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{inspections?.overdue || 0}</p>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarX className="w-5 h-5 text-rose-600" /> Compliance Status
              </h2>
              <Card className="bg-rose-50 border-0 shadow-sm rounded-2xl p-6 h-[calc(100%-2.5rem)] flex flex-col justify-center items-center text-center">
                <AlertTriangle className="w-10 h-10 text-rose-500 mb-3" />
                <h3 className="text-4xl font-bold text-rose-700">{expired?.totalExpired || 0}</h3>
                <p className="text-rose-600 font-medium mt-1">Expired Extinguishers</p>
                <p className="text-sm text-rose-500 mt-2 max-w-xs">These units require immediate replacement or recertification to meet safety codes.</p>
              </Card>
            </div>
          </section>

          {/* Maintenance History */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-600" /> Recent Maintenance History
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-900">Extinguisher</TableHead>
                    <TableHead className="font-semibold text-gray-900">Action Taken</TableHead>
                    <TableHead className="font-semibold text-gray-900">Date</TableHead>
                    <TableHead className="font-semibold text-gray-900">Resulting Condition</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(!maintenance?.recentActivities || maintenance.recentActivities.length === 0) ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">No recent maintenance recorded.</TableCell>
                    </TableRow>
                  ) : (
                    maintenance.recentActivities.map((log: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium text-indigo-600">{log.extinguisherId}</TableCell>
                        <TableCell>{log.actionTaken}</TableCell>
                        <TableCell className="text-gray-500">{new Date(log.dateOfAction).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            log.conditionNoted === 'Pass' ? 'bg-green-100 text-green-700' : 
                            log.conditionNoted === 'Fail' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {log.conditionNoted}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </section>

        </div>
      )}
    </DashboardLayout>
  );
}
