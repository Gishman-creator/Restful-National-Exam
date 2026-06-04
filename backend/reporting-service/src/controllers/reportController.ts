import { Controller, Get, Route, Tags } from 'tsoa';
import axios from 'axios';

// Assume services are on these ports. In prod, these would be env vars.
const EXTINGUISHER_SERVICE_URL = 'http://localhost:3002/extinguishers';
const INSPECTION_SERVICE_URL = 'http://localhost:3003/inspections';
const MAINTENANCE_SERVICE_URL = 'http://localhost:3003/maintenance'; // It's in the inspection service

@Route('reports')
@Tags('Reports')
export class ReportController extends Controller {

  @Get('inventory')
  public async getInventoryReport(): Promise<any> {
    try {
      // Fetch all extinguishers
      const response = await axios.get(`${EXTINGUISHER_SERVICE_URL}?limit=100000`);
      const extinguishers: any[] = response.data.data || [];

      const total = extinguishers.length;

      // Grouping logic based on createdAt
      const now = new Date();
      let daily = 0;
      let monthly = 0;
      let yearly = 0;

      extinguishers.forEach(ext => {
        const createdDate = new Date(ext.createdAt || ext.updatedAt || now); // Fallback if no dates
        
        // Check if created today
        if (createdDate.toDateString() === now.toDateString()) {
          daily++;
        }
        
        // Check if created this month
        if (createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()) {
          monthly++;
        }

        // Check if created this year
        if (createdDate.getFullYear() === now.getFullYear()) {
          yearly++;
        }
      });

      return {
        total,
        daily,
        monthly,
        yearly
      };
    } catch (error) {
      this.setStatus(500);
      return { message: 'Failed to generate inventory report' };
    }
  }

  @Get('inspections')
  public async getInspectionReport(): Promise<any> {
    try {
      const response = await axios.get(`${INSPECTION_SERVICE_URL}?limit=100000`);
      const inspections: any[] = response.data.data || [];

      const pending = inspections.filter(i => i.status === 'Scheduled').length;
      const completed = inspections.filter(i => i.status === 'Completed').length;
      const failed = inspections.filter(i => i.condition === 'Fail').length; // Assuming failed means condition === 'Fail'

      return {
        total: inspections.length,
        pending,
        completed,
        failed,
        overdue: 0 // Mocking overdue as we don't track due dates strictly on extinguishers yet
      };
    } catch (error) {
      this.setStatus(500);
      return { message: 'Failed to generate inspection report' };
    }
  }

  @Get('expired')
  public async getExpiredReport(): Promise<any> {
    try {
      const response = await axios.get(`${EXTINGUISHER_SERVICE_URL}?limit=100000`);
      const extinguishers: any[] = response.data.data || [];

      const now = new Date();
      
      const expired = extinguishers.filter(ext => {
        if (!ext.expirationDate) return false;
        return new Date(ext.expirationDate) < now;
      });

      return {
        totalExpired: expired.length,
        expiredExtinguishers: expired
      };
    } catch (error) {
      this.setStatus(500);
      return { message: 'Failed to generate expired report' };
    }
  }

  @Get('maintenance')
  public async getMaintenanceReport(): Promise<any> {
    try {
      const response = await axios.get(`${MAINTENANCE_SERVICE_URL}?limit=100000`);
      const logs: any[] = response.data.data || [];

      // Generate a frequency map by action taken
      const actionFrequency: Record<string, number> = {};
      logs.forEach(log => {
        actionFrequency[log.actionTaken] = (actionFrequency[log.actionTaken] || 0) + 1;
      });

      return {
        totalMaintenanceLogs: logs.length,
        recentActivities: logs.slice(0, 10), // Return last 10
        actionFrequency
      };
    } catch (error) {
      this.setStatus(500);
      return { message: 'Failed to generate maintenance report' };
    }
  }
}
