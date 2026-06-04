import { Controller, Get, Patch, Body, Route, Tags, Path } from 'tsoa';
import { UserModel, UserRole } from '../models/userModel';
import { UserResponse } from './authController';

export interface UpdateUserStatusRequest {
  isActive: boolean;
}

@Route('api/users')
@Tags('Users')
export class UserController extends Controller {
  
  @Get()
  public async getUsers(): Promise<UserResponse[]> {
    const users = await UserModel.find().sort({ createdAt: -1 });
    return users.map(user => ({
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive !== false // handle undefined as true for older records
    }));
  }

  @Get('{id}')
  public async getUser(@Path() id: string): Promise<UserResponse | void> {
    const user = await UserModel.findById(id);
    if (!user) {
      this.setStatus(404);
      return;
    }
    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive !== false
    };
  }

  @Patch('{id}/status')
  public async updateUserStatus(
    @Path() id: string,
    @Body() requestBody: UpdateUserStatusRequest
  ): Promise<UserResponse | void> {
    const user = await UserModel.findById(id);
    if (!user) {
      this.setStatus(404);
      throw new Error('User not found');
    }

    if (user.role === UserRole.Admin) {
      this.setStatus(403);
      throw new Error('Cannot deactivate admin users');
    }

    user.isActive = requestBody.isActive;
    await user.save();

    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive !== false
    };
  }
}
