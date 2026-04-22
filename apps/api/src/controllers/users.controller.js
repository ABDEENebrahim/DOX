import { z } from 'zod';
import { createUser, listUsers } from '../services/user.service.js';

export const createUserSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  role: z.enum(['admin', 'staff', 'patient', 'doctor'])
});

export async function createUserHandler(req, res, next) {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function listUsersHandler(req, res, next) {
  try {
    const users = await listUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}
