
import './App.css';
import { Route, Routes} from 'react-router-dom';
import Market from './components/Market/Market'
import Header from './components/Header/Header'
import Bucket from './components/Market/Bucket/Bucket'

function App() {
  return (
    <div className="App">
    <Header />
      <Routes>
  <Route path="/" element={<Market />} />
  <Route path="bucket" element={<Bucket />} /> 
  </Routes>
    </div>
  );
}

export default App;
