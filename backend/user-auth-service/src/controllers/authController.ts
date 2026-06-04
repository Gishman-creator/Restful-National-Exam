import { Body, Controller, Post, Route, SuccessResponse, Tags } from 'tsoa';
import { UserModel, UserRole } from '../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// DTOs
export interface UserRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role?: UserRole;
}

export interface UserLoginRequest {
  email: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
  };
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_dev';

@Route('api/auth')
@Tags('Authentication')
export class AuthController extends Controller {
  
  @SuccessResponse('201', 'Created')
  @Post('register')
  public async register(@Body() requestBody: UserRegisterRequest): Promise<AuthResponse | void> {
    try {
      const existingUser = await UserModel.findOne({ email: requestBody.email });
      if (existingUser) {
        this.setStatus(400);
        throw new Error('Email already exists');
      }

      const password = requestBody.password || 'password123';
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = new UserModel({
        ...requestBody,
        passwordHash,
        role: requestBody.role || UserRole.User,
      });

      await user.save();

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

      return {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      };
    } catch (error: any) {
      this.setStatus(500);
      throw error;
    }
  }

  @Post('login')
  public async login(@Body() requestBody: UserLoginRequest): Promise<AuthResponse | void> {
    try {
      const user = await UserModel.findOne({ email: requestBody.email });
      if (!user) {
        this.setStatus(401);
        throw new Error('Invalid credentials');
      }

      if (user.isActive === false) {
        this.setStatus(401);
        throw new Error('User account has been deactivated');
      }

      const password = requestBody.password || 'password123';
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        this.setStatus(401);
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

      return {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      };
    } catch (error: any) {
      this.setStatus(500);
      throw error;
    }
  }
}
