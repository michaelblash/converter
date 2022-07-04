import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, firstValueFrom } from 'rxjs';
import * as iconv from 'iconv-lite';
import * as moment from 'moment';
import { XMLParser } from 'fast-xml-parser';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from './currency.entity';
import { Rate } from './rate.entity';



@Injectable()
export class CurrenciesService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Currency) private readonly currencyRepository: Repository<Currency>,
    @InjectRepository(Rate) private readonly rateRepository: Repository<Rate>,
    ) {}

  async getCurrencies(date) {
    const rates = await this.rateRepository.find({
      where: {
        date
      },
      relations: {
        currency: true
      }
    });

    if (rates.length === 0) {
      const parser = new XMLParser();

      let scrapped;
      try {
        scrapped = await firstValueFrom(
          this.httpService.get('https://www.cbr.ru/scripts/XML_daily.asp', {
            responseEncoding: 'binary',
            params: {
              date_req: moment(date).format('DD/MM/YYYY')
            }
          })
            .pipe(map(({ data }) => {
              const converted = iconv.decode(data, 'windows-1251');
              return parser.parse(converted);
            }))
        );
      } catch (e) {
        console.error(e);

        throw new BadRequestException('Failed to scrape');
      }


      const newRates = scrapped.ValCurs.Valute;

      const currencies = await this.currencyRepository.find();

      const outputRates = [];

      for (const rate of newRates) {
        let currency = currencies.find(cur => cur.code === rate.NumCode);

        if (!currency) {
          currency = new Currency();

          currency.code = rate.NumCode;
          currency.name = rate.Name;
          currency.charCode = rate.CharCode;


          await this.currencyRepository.save<Currency>(currency);
        }

        const newRate = new Rate();

        newRate.nominal = rate.Nominal;
        newRate.value = parseFloat(rate.Value.replace(/,/, '.'));
        newRate.date = date;
        newRate.currency = currency;

        await this.rateRepository.save(newRate);

        outputRates.push(newRate);
      }

      return outputRates;
    }

    return rates;
  }
}
