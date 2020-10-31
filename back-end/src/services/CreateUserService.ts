import { getRepository } from 'typeorm';
import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User, process.env.NODE_ENV);

    const checkUserExistis = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExistis) {
      throw new Error('Email address already used');
    }

    const user = usersRepository.create({ name, email, password });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
