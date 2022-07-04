import { Module } from '@nestjs/common';
import { runSeeders } from 'typeorm-extension';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { DataSource } from 'typeorm';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend/build'),
      exclude: ['/api*']
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => typeOrmConfig,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();

        await runSeeders(dataSource, {
          seeds: ['src/seeds.ts'],
        });

        return dataSource;
      }
    }),
    AuthModule,
    CurrenciesModule
  ]
})
export class AppModule {}
