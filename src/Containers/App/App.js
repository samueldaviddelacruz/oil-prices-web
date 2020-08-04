import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "./App.css";

const OIL_PRICES_URL =
  "https://fy2imwzr1f.execute-api.us-west-2.amazonaws.com/dev/oil-prices";

/*
  init values for the chart to render,
  here we define values like the title, the Y axis and X axis,
  and and empty series array.

*/
const initialOptions = {
  title: {
    text: "DR Oil Prices History (DOP)",
  },
  yAxis: {
    title: {
      text: "Prices",
    },
  },
  xAxis: {
    type: "datetime",
  },
  series: [],
};

//small helper function to fetch data from the API
const fetchOilPrices = async (startDate = 0, endDate = 0) => {
  try {
    let url = `${OIL_PRICES_URL}?startDate=${startDate}`;
    if (endDate > 0) {
      url += `&endDate=${endDate}`;
    }
    const oilPrices = await fetch(url).then((r) => r.json());

    return oilPrices;
  } catch (err) {
    console.error(err);
    return [];
  }
};

/*
  Mapping function that will extract both the time the oil was measured and its price at the time,
  it will also map the title to the name prop accepted by the series array, output structure : [  { name:oilTitle,data:[oilMeasureTime,price]  }   ]
*/
const getSeriesFromOilPrices = (oilPrices = []) => {
  const titles = [...new Set(oilPrices.map((obj) => obj.title))];
  const series = titles.map((title) => {
    const pricesPerTitle = oilPrices
      .filter((obj) => obj.title === title)
      .map((obj) => [obj.timeMeasured, obj.price]);

    return { name: title, data: pricesPerTitle };
  });

  return series;
};

function App() {
  //oilPrices setter/getter
  const [oilPrices, setOilPrices] = useState([]);
  //date pickers setters/getters
  const [fromDateMillis, setFromDateMillis] = useState(0);
  const [toDateMillis, setToDateMillis] = useState(0);

  //Fetch and set all oil prices at the start
  useEffect(() => {
    if (!oilPrices.length) {
      fetchOilPrices().then((fetchedOilPrices) => {
        setOilPrices(fetchedOilPrices);
      });
    }
  }, [oilPrices]);

  const onFromDateChange = (event) => {
    const date = event.target.valueAsDate;
    const milliseconds = date.getTime();
    fetchOilPrices(milliseconds, toDateMillis).then((fetchedOilPrices) => {
      setOilPrices(fetchedOilPrices);
    });
    setFromDateMillis(milliseconds);
  };

  const onToDateChange = (event) => {
    const date = event.target.valueAsDate;
    const milliseconds = date.getTime();
    fetchOilPrices(fromDateMillis, milliseconds).then((fetchedOilPrices) => {
      setOilPrices(fetchedOilPrices);
    });
    setToDateMillis(milliseconds);
  };

  //update the chart options based on the prices fetched from the API
  const chartSeries = getSeriesFromOilPrices(oilPrices);
  const chartOptions = {
    ...initialOptions,
    series: chartSeries,
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      <div className="inputs">
        <div className="input-container">
          <label id="from-label">From</label>
          <input id="from-date" type="date" onChange={onFromDateChange}></input>
        </div>
        <div className="input-container">
          <label id="to-label">To</label>
          <input id="to-date" type="date" onChange={onToDateChange}></input>
        </div>
      </div>
    </div>
  );
}

export default App;
