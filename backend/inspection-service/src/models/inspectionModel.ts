import mongoose, { Document, Schema } from 'mongoose';

export interface IInspection extends Document {
  extinguisherId: string;
  inspectorId: string;
  date: Date;
  condition?: 'Pass' | 'Fail' | 'NeedsMaintenance';
  notes?: string;
  status: 'Scheduled' | 'Completed';
  scheduledDate?: Date;
  personnelNotified?: boolean;
}

const InspectionSchema: Schema = new Schema({
  extinguisherId: { type: String, required: true },
  inspectorId: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  condition: { type: String, enum: ['Pass', 'Fail', 'NeedsMaintenance'], required: false },
  notes: { type: String, required: false },
  status: { type: String, enum: ['Scheduled', 'Completed'], required: true, default: 'Completed' },
  scheduledDate: { type: Date, required: false },
  personnelNotified: { type: Boolean, required: false, default: false }
});

export const Inspection = mongoose.model<IInspection>('Inspection', InspectionSchema);
