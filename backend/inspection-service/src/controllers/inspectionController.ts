import { Controller, Get, Post, Put, Route, Body, Tags, Query, Path } from 'tsoa';
import { Inspection } from '../models/inspectionModel';
import { sendEmailToInspectors } from '../utils/emailService';
import mongoose from 'mongoose';

interface InspectionPayload {
  extinguisherId: string;
  inspectorId: string;
  condition: 'Pass' | 'Fail' | 'NeedsMaintenance';
  notes?: string;
}

interface SchedulePayload {
  extinguisherId: string;
  userId: string;
  scheduledDate: Date;
  personnelNotified?: boolean;
}

interface AnswerInspectionPayload {
  condition: 'Pass' | 'Fail' | 'NeedsMaintenance';
  notes?: string;
  inspectorId: string;
}

@Route('inspections')
@Tags('Inspections')
export class InspectionController extends Controller {
  
  @Get()
  public async getInspections(
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Query() extinguisherId?: string
  ): Promise<{ data: any[], total: number, page: number, limit: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    const query = extinguisherId ? { extinguisherId } : {};
    
    const [inspections, total] = await Promise.all([
      Inspection.find(query).skip(skip).limit(limit).sort({ date: -1 }),
      Inspection.countDocuments(query)
    ]);
    
    return {
      data: inspections,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  @Post()
  public async createInspection(@Body() requestBody: InspectionPayload): Promise<any> {
    const inspection = new Inspection({
      ...requestBody,
      date: new Date(),
      status: 'Completed'
    });
    
    await inspection.save();
    return { message: 'Inspection logged successfully', data: inspection };
  }

  @Post('schedule')
  public async scheduleInspection(@Body() requestBody: SchedulePayload): Promise<any> {
    if (requestBody.personnelNotified) {
      try {
        await sendEmailToInspectors(`An inspection has been scheduled for extinguisher ${requestBody.extinguisherId} on ${requestBody.scheduledDate}`);
      } catch (error: any) {
        this.setStatus(500);
        return { message: 'Failed to send notification email. Schedule aborted.', error: error.message };
      }
    }

    const inspection = new Inspection({
      extinguisherId: requestBody.extinguisherId,
      inspectorId: requestBody.userId, // Storing scheduling user as the initiator for now, or could add scheduledBy
      scheduledDate: requestBody.scheduledDate,
      personnelNotified: requestBody.personnelNotified || false,
      status: 'Scheduled',
      date: new Date() // created date
    });

    await inspection.save();
    return { message: 'Inspection scheduled successfully', data: inspection };
  }

  @Put('{id}/answer')
  public async answerInspection(
    @Path() id: string,
    @Body() requestBody: AnswerInspectionPayload
  ): Promise<any> {
    const inspection = await Inspection.findById(id);
    if (!inspection) {
      this.setStatus(404);
      return { message: 'Inspection not found' };
    }

    inspection.status = 'Completed';
    inspection.condition = requestBody.condition;
    inspection.notes = requestBody.notes;
    // Update the inspectorId to the one who answered it
    inspection.inspectorId = requestBody.inspectorId;
    inspection.date = new Date(); // Update the date to when it was actually completed

    await inspection.save();
    return { message: 'Inspection completed successfully', data: inspection };
  }
}
