import React, { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "./App.css";
const OIL_PRICES_URL =
  "https://fy2imwzr1f.execute-api.us-west-2.amazonaws.com/dev/oil-prices";
const options = {
  title: {
    text: "DR Oil Prices History (DOP)",
  },
  yAxis: {
    title: {
      text: "Prices",
    },
  },
  xAxis: {
    type:'datetime'
},
  series: [],
};
const fetchOilPrices = async () => {
  try {
    const oilPrices = await fetch(OIL_PRICES_URL).then((r) => r.json());
    
    return oilPrices;
  } catch (err) {
    console.error(err);
    return [];
  }
};
const getSeriesFromOilPrices = (oilPrices = []) => {
  const titles = [...new Set(oilPrices.map((obj) => obj.title))];

  const series = titles.map((title) => {
    const pricesPerTitle = oilPrices
      .filter((obj) => obj.title === title)
      .map((obj) => [obj.timeMeasured,obj.price]  );

    return { name: title, data: pricesPerTitle };
  });

  return series;
};
function App() {
  const [chartOptions, setChartOptions] = useState(options);
  const updateChart = async (event) => {
    const oilPrices = await fetchOilPrices();
    const chartSeries = getSeriesFromOilPrices(oilPrices);
    
    const newOptions = {
      ...chartOptions,
      series: chartSeries,
    };
    setChartOptions(newOptions);
  };
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      <button onClick={updateChart}> Update chart </button>
    </div>
  );
}

export default App;
