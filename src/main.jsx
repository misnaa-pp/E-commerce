import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'
import { store } from './redux/store.js'
import { BrowserRouter } from 'react-router-dom'
import "./responsive.css";
import { updateTokens, logout } from "./redux/slices/AuthSlice";



window.addEventListener("authTokensUpdated", (event) => {
    store.dispatch(updateTokens(event.detail));
});

window.addEventListener("authSessionExpired", () => {
    store.dispatch(logout());
});



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
       <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
