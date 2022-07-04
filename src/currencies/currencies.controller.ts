import { UseGuards, Controller, Get, Query, BadRequestException, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as moment from 'moment';
import { CurrenciesService } from './currencies.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  getCurrencies(@Query('date') date: string) {
    let targetDate;

    if (!date) {
      targetDate = moment().startOf('date');
    } else {
      const parsedDate = moment(date, 'DD-MM-YYYY');

      if (parsedDate.isValid()) {
        targetDate = parsedDate;
      } else {
        throw new BadRequestException('Bad date format');
      }
    }

    return this.currenciesService.getCurrencies(targetDate.toDate());
  }
}
