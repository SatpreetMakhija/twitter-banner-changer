import { useEffect, useState } from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import create from 'zustand';

import MyNavBar from './components/MyNavBar';
import Home from './pages/Home';
import CreateAlbum from './pages/CreateAlbum';
import ShowAlbum from './pages/ShowAlbum';

const useStore = create((set) => ({
  bears:0
}))

console.log(typeof(useStore));
function App() { 
  return (
    <div>

      <MyNavBar/>
        <BrowserRouter>
          <Routes>
            <Route path="/" exact element={<Home/>}/>
            <Route path = "/create-album" element={<CreateAlbum/>}/>
            <Route path = "/:userid/:albumid" element={<ShowAlbum/>}/>
          </Routes>
        </BrowserRouter>
      

      
    </div>
    
    
  );
}

export default App;
