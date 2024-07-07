import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = this.userRepository.findOne({
      where: { id },
      relations: [
        'wallets',
        'transactions',
        'transactions.fromUser',
        'transactions.toUser',
        'receivedTransactions',
        'receivedTransactions.fromUser',
        'receivedTransactions.toUser',
        'orders',
        'marketListings',
      ],
    });
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return user;
  }

  async create(user: Partial<User>): Promise<User> {
    const newuser = this.userRepository.create(user);
    return this.userRepository.save(newuser);
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    await this.userRepository.update(id, user);
    return this.userRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.userRepository.delete(id);
  }
}
