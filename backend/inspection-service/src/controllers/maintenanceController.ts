import { Controller, Get, Post, Put, Route, Body, Tags, Query, Path } from 'tsoa';
import { Maintenance } from '../models/maintenanceModel';

interface MaintenanceCreatePayload {
  extinguisherId: string;
  inspectorId: string;
  actionTaken: string;
  dateOfAction: Date;
  conditionNoted: 'Pass' | 'Fail' | 'NeedsMaintenance';
}

interface MaintenanceUpdatePayload {
  actionTaken?: string;
  dateOfAction?: Date;
  // conditionNoted is explicitly omitted from update payload
}

@Route('maintenance')
@Tags('Maintenance')
export class MaintenanceController extends Controller {
  
  @Get()
  public async getMaintenanceLogs(
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Query() extinguisherId?: string
  ): Promise<{ data: any[], total: number, page: number, limit: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    const query = extinguisherId ? { extinguisherId } : {};
    
    const [logs, total] = await Promise.all([
      Maintenance.find(query).skip(skip).limit(limit).sort({ dateOfAction: -1 }),
      Maintenance.countDocuments(query)
    ]);
    
    return {
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  @Post()
  public async logMaintenance(@Body() requestBody: MaintenanceCreatePayload): Promise<any> {
    const log = new Maintenance(requestBody);
    await log.save();
    return { message: 'Maintenance logged successfully', data: log };
  }

  @Put('{id}')
  public async updateMaintenance(
    @Path() id: string,
    @Body() requestBody: MaintenanceUpdatePayload
  ): Promise<any> {
    // Condition noted during the maintenance can not update.
    // Ensure conditionNoted is not in the request body, or if it is, it gets stripped/ignored.
    // The type `MaintenanceUpdatePayload` already omits it.
    
    const log = await Maintenance.findByIdAndUpdate(id, { $set: requestBody }, { new: true });
    if (!log) {
      this.setStatus(404);
      return { message: 'Maintenance log not found' };
    }
    
    return { message: 'Maintenance updated successfully (Condition remains unchanged)', data: log };
  }
}
