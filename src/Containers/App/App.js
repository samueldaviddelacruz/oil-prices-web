import React,{useState} from 'react';
import './App.css';

function App() {
  const [number,setNumber] = useState(0)
  const increaseNumber = (event) => {
    setNumber(number + 1)
  }
  return (
    <div>
      <p>{number}</p>
      <button onClick={increaseNumber}> ok </button>
    </div>
  );
}

export default App;
