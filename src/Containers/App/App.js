import React, { useState, useEffect, useCallback } from "react";
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
    type: "datetime",
  },
  series: [],
};
const fetchOilPrices = async (startDate=0,endDate = 0) => {
  try {
    let url = `${OIL_PRICES_URL}?startDate=${startDate}`
    if(endDate > 0){
      url += `&endDate=${endDate}`
    }
    const oilPrices = await fetch(url).then((r) => r.json());

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
      .map((obj) => [obj.timeMeasured, obj.price]);

    return { name: title, data: pricesPerTitle };
  });

  return series;
};
function App() {
  const [oilPrices,setOilPrices] = useState([])
  const [fromDateMillis,setFromDateMillis] = useState(0)
  const [toDateMillis,setToDateMillis] = useState(0)
 
  useEffect(() => {
    if(!oilPrices.length){
      fetchOilPrices().then( fetchedOilPrices => {
        setOilPrices(fetchedOilPrices);
      }) 
    }
    
  }, [oilPrices]);

 
  const onFromDateChange = (event) => {
    const date = event.target.valueAsDate
    const milliseconds = date.getTime()
    console.log(milliseconds)
    fetchOilPrices(milliseconds,toDateMillis).then( fetchedOilPrices => {
      setOilPrices(fetchedOilPrices);
    }) 
    setFromDateMillis(milliseconds)
  }
  const onToDateChange = (event) => {
    const date = event.target.valueAsDate
    const milliseconds = date.getTime()
  
    fetchOilPrices(fromDateMillis,milliseconds).then( fetchedOilPrices => {
      setOilPrices(fetchedOilPrices);
    }) 
    setToDateMillis(milliseconds)
  }
  const chartSeries = getSeriesFromOilPrices(oilPrices);
  const chartOptions = {
    ...options,
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
