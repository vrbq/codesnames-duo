import { useState } from 'react';
import './App.css';
import Tiles from './Tiles/Tiles';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div></div>
      <h1>Transform Codes Names into CodeNames Duo</h1>
      <div className="App">
        <Tiles />
      </div>
    </>
  );
}

export default App;
