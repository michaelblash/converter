import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import { DatePicker, Space } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import Api from '../api';
import Dropdown from '../components/Dropdown';
import { selectIsAuthenticated, logout } from '../store/features/auth/authSlice';
import Chart from '../components/Chart';


const compare = (ratesByDates, fromCur, toCur) => {
  const ratesFromCur = Object.entries(ratesByDates).map(([date, rates]) => {
    return [date, rates.find(rate => rate.currency.code === fromCur)];
  }).filter(val => val[1]);

  const ratesToCur = Object.entries(ratesByDates).map(([date, rates]) => {
    return [date, rates.find(rate => rate.currency.code === toCur)];
  });

  return ratesFromCur.reduce((acc, val) => {
    const toCurRate = ratesToCur.find(rate => rate[0] === val[0]);

    if (toCurRate) {
      return [...acc, [val[0], val[1].value / val[1].nominal * toCurRate[1].nominal / toCurRate[1].value]];
    }

    return acc;
  }, []).map(val => [{ date: new Date(val[0].split('-').reverse().join('-')) }, val[1]]);
};

export default () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isLoading, setIsLoading] = useState(false);
  const [ratesByDates, setRatesByDates] = useState({});
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [fromValue, setFromValue] = useState(0);
  const [toValue, setToValue] = useState(0);
  const [date, setDate] = useState(moment().format('DD-MM-YYYY'));
  const [error, setError] = useState();

  const setRates = (date, rates) => {
    if (date) {
      setRatesByDates(prev => ({
        ...prev,
        [date]: rates
      }));
    }
  };

  const convert = () => {
    const fromRate = ratesByDates[date].find(rate => rate.currency.code === fromCurrency);
    const toRate = ratesByDates[date].find(rate => rate.currency.code === toCurrency);

    setToValue(fromValue * fromRate.value / fromRate.nominal * toRate.nominal / toRate.value);
  };

  const onChangeDate = (_, strDate) => {
    if (!strDate) {
      return;
    }

    setDate(strDate.split('-').reverse().join('-'));
  };

  const onChangeFromCurrency = newCur => {
    setFromCurrency(newCur);
  };

  const onChangeToCurrency = newCur => {
    setToCurrency(newCur);
  };

  useEffect(() => {
    setIsLoading(true);
    setError('');
    Api.getCurrencies(date).then(result => {
      setRates(date, result.data);
      if (result.data.length) {
        setFromCurrency(result.data[0].currency.code);
        setToCurrency(result.data[0].currency.code);
      }
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [date]);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      convert();
    }
  }, [fromCurrency, toCurrency, fromValue]);

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  return (
    <div>
      <div style={{ fontSize: '20px', textAlign: 'right'}}><span style={{ cursor: 'pointer' }} onClick={() => {
        dispatch(logout());
      }}>Logout</span></div>
      <h1>Converter</h1>
      <div>
        <Space direction="vertical">
          <DatePicker onChange={onChangeDate} />
        </Space>
      </div>
      <div>
        {
          isLoading ? <span>Loading...</span> : error ? <div>{error}</div> : !!ratesByDates[date] &&
          <>
            <NumberFormat
              allowNegative={false}
              value={fromValue}
              onValueChange={values => setFromValue(values.floatValue)}
            />
            <Dropdown
              value={fromCurrency}
              onChange={val => onChangeFromCurrency(val)}
              options={ratesByDates[date].map(c => ({ value: c.currency.code, title: c.currency.name }))}
            />
            <span>=</span>
            <NumberFormat
            displayType="text"
              allowNegative={false}
              value={toValue}
              decimalScale={2}
            />
            <Dropdown
              value={toCurrency}
              onChange={val => onChangeToCurrency(val)}
              options={ratesByDates[date].map(c => ({ value: c.currency.code, title: c.currency.name }))}
            />
          </>
        }
      </div>

      <div>
        <Chart options={compare(ratesByDates, fromCurrency, toCurrency)} />
      </div>
    </div>
  );
};
