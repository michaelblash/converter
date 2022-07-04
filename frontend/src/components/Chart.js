import Highcharts from 'highcharts/highstock';
import HightchartsReact from 'highcharts-react-official';


export default ({ options }) => {
  const chartOptions = {
    title: {
      text: 'Currency ratios'
    },
    series: [
      {
        data: options.map(val => [val[0].date.getTime(), val[1]]).sort((a, b) => a[0] - b[0]).map(val => ({
          x: val[0],
          y: val[1],
          name: new Date(val[0])
        }))
      }
    ],
    xAxis: {
      labels: {
        formatter: function() {
          return new Date(this.value).toISOString().slice(0, 10)
        }
      },
  },
  };


  return <HightchartsReact
    highcharts={Highcharts}
    options={chartOptions}
  />;
};
