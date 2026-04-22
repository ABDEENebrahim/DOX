import { User } from '../models/user.model.js';

export async function createUser(payload) {
  return User.create(payload);
}

export async function listUsers() {
  return User.find({}).sort({ createdAt: -1 }).lean();
}
