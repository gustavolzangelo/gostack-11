import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

interface UserResponse {
  id: string;
  name: string;
  password?: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}
class CreateUserService {
  public async execute({
    name,
    email,
    password,
  }: Request): Promise<UserResponse> {
    const usersRepository = getRepository(User, process.env.NODE_ENV);

    const checkUserExistis = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExistis) {
      throw new Error('Email address already used');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
