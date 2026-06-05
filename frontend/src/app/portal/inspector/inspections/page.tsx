'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ShieldAlert, FileText, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

export default function InspectorInspectionsList() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [statusFilter, setStatusFilter] = useState('All');
  const [conditionFilter, setConditionFilter] = useState('All');

  const fetchInspections = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/inspections?limit=1000`);
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

  const filteredInspections = inspections.filter(insp => {
    let matchStatus = true;
    let matchCondition = true;
    
    if (statusFilter !== 'All') {
      matchStatus = insp.status === statusFilter;
    }
    
    if (conditionFilter !== 'All') {
      // If an inspection is scheduled, it might not have a condition yet.
      matchCondition = insp.condition === conditionFilter;
    }
    
    return matchStatus && matchCondition;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">All Inspections</h1>
          <p className="text-gray-500 mt-2">View and filter through all inspections.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center bg-gray-50/50 gap-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            Filter Inspections
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "All")}>
                <SelectTrigger className="w-full bg-white h-12">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-48">
              <Select value={conditionFilter} onValueChange={(val) => setConditionFilter(val || "All")}>
                <SelectTrigger className="w-full bg-white h-12">
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Conditions</SelectItem>
                  <SelectItem value="Pass">Pass</SelectItem>
                  <SelectItem value="Fail">Fail</SelectItem>
                  <SelectItem value="NeedsMaintenance">Needs Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-pulse"><ShieldAlert className="w-8 h-8 text-gray-300" /></div></div>
        ) : (
          <Table>
            <TableHeader className="bg-white">
              <TableRow>
                <TableHead className="font-semibold text-gray-900">Date</TableHead>
                <TableHead className="font-semibold text-gray-900">Extinguisher ID</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-semibold text-gray-900">Condition</TableHead>
                <TableHead className="font-semibold text-gray-900">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInspections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    No inspections match your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInspections.map((insp) => (
                  <TableRow key={insp._id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {insp.status === 'Completed' && insp.date 
                          ? new Date(insp.date).toLocaleDateString()
                          : insp.scheduledDate 
                            ? new Date(insp.scheduledDate).toLocaleDateString() 
                            : 'N/A'
                        }
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-indigo-600">{insp.extinguisherId}</TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        insp.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {insp.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {insp.condition ? (
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${insp.condition === 'Pass' ? 'bg-green-100 text-green-700' :
                            insp.condition === 'Fail' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                          {insp.condition === 'NeedsMaintenance' ? 'Maintenance' : insp.condition}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
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
