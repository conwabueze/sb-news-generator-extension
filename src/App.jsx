import { useState, useEffect } from 'react'
import './App.css'
import Form from './components/Form';
import Token from './components/Token';
import Navigation from './components/Navigation';
import { HashRouter, Routes, Route } from 'react-router-dom';
import StaffbaseLogo from './assets/StaffbaseLogo.png';




function App() {

  const [sbTokenInStorage, setSbTokenInStorage] = useState(true);

  useEffect(() => {
    const getStorageValue = async () => {
      try {
        const result = await chrome.storage.local.get('sbToken');
        console.log(result);
        if (result.sbToken) {
          setSbTokenInStorage(true);
        }
      } catch (error) {
        console.error('Error retrieving attribute:', error);
      }
    };

    getStorageValue();
  }, []); // Empty dependency array ensures it runs only once on mount

  const routes = (
    <HashRouter>
      <Routes>
        <Route path="/" element={!sbTokenInStorage ? <Token sbTokenInStorage={sbTokenInStorage} setSbTokenInStorage={setSbTokenInStorage} /> : <Navigation />} />
        <Route path="/menu" element={<Navigation />} />
        <Route path="/get-linkedin-article" element={<Form newsType={"articles"} />} />
        <Route path="/get-linkedin-updates" element={<Form newsType={"updates"} />} />
        <Route path="/get-token" element={<Token sbTokenInStorage={sbTokenInStorage} setSbTokenInStorage={setSbTokenInStorage} />} />
      </Routes>
    </HashRouter>
  );

  return (

    <div className="app">
      {console.log(sbTokenInStorage)}
      {console.log('reloading!!!!! again')}
      <div className='app-header'>
      <img src={StaffbaseLogo}/>
      <span className="app-title">News Generator</span>
      </div>
      <div className="app-content">
        {routes}
      </div>

    </div>
  )


}

export default App
