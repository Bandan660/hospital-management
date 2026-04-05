import { User, UserRole } from '../models/User.model';
import { generateToken, JwtPayload } from '../utils/jwt';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Partial<User>;
}

export class AuthService {

  async register(data: RegisterDTO): Promise<AuthResponse> {
    // Check duplicate email
    const existing = await User.findOne({ where: { email: data.email } });
    if (existing) {
      throw { status: 409, message: 'Email already registered' };
    }

    const user = await User.create({
      name:     data.name,
      email:    data.email,
      password: data.password,
      role:     data.role || UserRole.ADMIN,  // first user is admin
    });

    const payload: JwtPayload = { id: user.id, email: user.email, role: user.role };
    const token = generateToken(payload);

    return { token, user: user.toJSON() };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    // Find user by email
    const user = await User.findOne({ where: { email: data.email } });
    if (!user) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    // Check active
    if (!user.isActive) {
      throw { status: 403, message: 'Account is deactivated. Contact admin.' };
    }

    // Compare password
    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    const payload: JwtPayload = { id: user.id, email: user.email, role: user.role };
    const token = generateToken(payload);

    return { token, user: user.toJSON() };
  }

  async getProfile(id: number): Promise<User> {
    const user = await User.findByPk(id);
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }
    return user;
  }
}

export default new AuthService();