import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import {BrowserRouter} from 'react-router-dom';
import ChatProvider from './Context/ChatProvider';
 import reportWebVitals from "./reportWebVitals";


ReactDOM.render(
 
  <ChakraProvider>
  <BrowserRouter>
   <ChatProvider>
   <App/> 
   </ChatProvider>
  </BrowserRouter>
  </ChakraProvider>
  
  
  ,document.getElementById('root')
);

reportWebVitals();


