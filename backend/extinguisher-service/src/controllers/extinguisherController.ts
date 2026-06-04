import { Body, Controller, Post, Get, Put, Delete, Route, Path, Tags, Response, SuccessResponse, Query } from 'tsoa';
import { ExtinguisherModel, IExtinguisher, ExtinguisherType, ExtinguisherStatus, ExtinguisherSize } from '../models/extinguisherModel';

export interface ExtinguisherCreateRequest {
  serialNumber: string;
  type: ExtinguisherType;
  size: ExtinguisherSize;
  location: string;
  assignedTo?: string;
  status?: ExtinguisherStatus;
  manufacturingDate?: Date;
  expirationDate?: Date;
}

export interface ExtinguisherUpdateRequest {
  type?: ExtinguisherType;
  size?: ExtinguisherSize;
  location?: string;
  assignedTo?: string;
  status?: ExtinguisherStatus;
}

export interface PaginatedExtinguisherResponse {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Route("extinguishers")
@Tags("Extinguishers")
export class ExtinguisherController extends Controller {
  @Post()
  @SuccessResponse("201", "Created")
  public async createExtinguisher(
    @Body() requestBody: ExtinguisherCreateRequest
  ): Promise<any> {
    const exists = await ExtinguisherModel.findOne({ serialNumber: requestBody.serialNumber });
    if (exists) {
      this.setStatus(400);
      return { message: "Extinguisher with this serial number already exists" };
    }
    const ext = new ExtinguisherModel(requestBody);
    await ext.save();
    this.setStatus(201);
    return ext;
  }



  @Get()
  public async getExtinguishers(
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<PaginatedExtinguisherResponse> {
    const skip = (page - 1) * limit;
    const total = await ExtinguisherModel.countDocuments();
    const data = await ExtinguisherModel.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  @Get("{id}")
  public async getExtinguisher(@Path() id: string): Promise<any> {
    const ext = await ExtinguisherModel.findById(id);
    if (!ext) {
      this.setStatus(404);
      return { message: "Not Found" };
    }
    return ext;
  }

  @Put("{id}")
  public async updateExtinguisher(
    @Path() id: string,
    @Body() requestBody: ExtinguisherUpdateRequest
  ): Promise<any> {
    const ext = await ExtinguisherModel.findByIdAndUpdate(id, requestBody, { new: true });
    if (!ext) {
      this.setStatus(404);
      return { message: "Not Found" };
    }
    return ext;
  }

  @Delete("{id}")
  @SuccessResponse("204", "Deleted")
  public async deleteExtinguisher(@Path() id: string): Promise<void> {
    await ExtinguisherModel.findByIdAndDelete(id);
  }
}
