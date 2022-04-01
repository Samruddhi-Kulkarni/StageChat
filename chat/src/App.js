import React from 'react';
import Home from './Pages/Home';
import Chat from './Pages/Chat';
import {Routes,  Route} from 'react-router-dom';
import './App.css';


const App= ()=> {
  return (
    <>
  
    <div className='App'>
  
    <Routes>
  
      <Route path='/' element={<Home />} exact />
      <Route path='/chats' element={<Chat />} />
      
  
    </Routes>
       
    </div>
    </>
  );
}

export default App;
