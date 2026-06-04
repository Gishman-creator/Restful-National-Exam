import mongoose, { Document, Schema } from 'mongoose';

export interface IMaintenance extends Document {
  extinguisherId: string;
  inspectorId: string;
  actionTaken: string;
  dateOfAction: Date;
  conditionNoted: 'Pass' | 'Fail' | 'NeedsMaintenance';
}

const MaintenanceSchema: Schema = new Schema({
  extinguisherId: { type: String, required: true },
  inspectorId: { type: String, required: true },
  actionTaken: { type: String, required: true },
  dateOfAction: { type: Date, required: true },
  conditionNoted: { type: String, enum: ['Pass', 'Fail', 'NeedsMaintenance'], required: true },
}, { timestamps: true });

export const Maintenance = mongoose.model<IMaintenance>('Maintenance', MaintenanceSchema);
