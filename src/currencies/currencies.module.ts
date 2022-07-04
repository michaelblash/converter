import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrenciesController } from './currencies.controller';
import { CurrenciesService } from './currencies.service';
import { Currency } from './currency.entity';
import { Rate } from './rate.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Currency, Rate])
  ],
  controllers: [CurrenciesController],
  providers: [CurrenciesService]
})
export class CurrenciesModule {}
