import mongoose, { Schema, Document } from 'mongoose';

export enum ExtinguisherType {
  Water = 'Water',
  Foam = 'Foam',
  CO2 = 'CO2',
  DryPowder = 'DryPowder',
  WetChemical = 'WetChemical'
}

export enum ExtinguisherStatus {
  Active = 'Active',
  RequiresMaintenance = 'RequiresMaintenance',
  OutOfService = 'Out-of-Service'
}

export enum ExtinguisherSize {
  Size2_5 = '2.5 lbs.',
  Size5 = '5 lbs.',
  Size9 = '9 lbs.',
  Size12 = '12 lbs.'
}

export interface IExtinguisher extends Document {
  serialNumber: string;
  type: ExtinguisherType;
  size: ExtinguisherSize;
  location: string;
  assignedTo?: string; // We can store user email or ID
  status: ExtinguisherStatus;
  manufacturingDate?: Date;
  expirationDate?: Date;
}

const ExtinguisherSchema = new Schema({
  serialNumber: { type: String, required: true, unique: true },
  type: { type: String, enum: Object.values(ExtinguisherType), required: true },
  size: { type: String, enum: Object.values(ExtinguisherSize), required: true },
  location: { type: String, required: true },
  assignedTo: { type: String, default: null },
  status: { type: String, enum: Object.values(ExtinguisherStatus), default: ExtinguisherStatus.Active },
  manufacturingDate: { type: Date },
  expirationDate: { type: Date }
}, { timestamps: true });

export const ExtinguisherModel = mongoose.model<IExtinguisher>('Extinguisher', ExtinguisherSchema);
