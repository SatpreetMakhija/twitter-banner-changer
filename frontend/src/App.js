import { useEffect, useState } from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import MyNavBar from './components/MyNavBar';
import Home from './pages/Home';
import CreateAlbum from './pages/CreateAlbum';
import ShowAlbum from './pages/ShowAlbum';
import ShowImg from './pages/ShowImg';
import Admin from "./pages/Admin";
function App() { 
  return (
    <div>

      <MyNavBar/>
        <BrowserRouter>
          <Routes>
            <Route path="/" exact element={<Home/>}/>
            <Route path = "/create-album" element={<CreateAlbum/>}/>
            <Route path= "/showimg" element = {<ShowImg/>}/>
            <Route path = "/album/:albumid" element={<ShowAlbum/>}/>
           <Route path = "/admin" element = {<Admin/>}/>
                    </Routes>
        </BrowserRouter>
      

      
    </div>
    
    
  );
}

export default App;
