import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { passwordConstants } from './config/constants';
import { User } from './auth/user.entity';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const repository = dataSource.getRepository(User);
    try {
      const password = await bcrypt.hash('qwerty', passwordConstants.saltRounds);

      await repository.insert([
        {
          username: 'michael',
          password
        }
      ]);
    } catch (e) {
      console.error(e);
    }
  }
}