import React from 'react';
import ReactDOM from 'react-dom/client';
//import 'bootstrap/dist/css/bootstrap.min.css';
import './assests/styles/index.css';
import './assests/styles/bootstrap.custom.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import store from './Store';
import {Provider} from 'react-redux'
import App from './App';
import Homescreen from './screens/Homescreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import Registration from './screens/Registration';
import ShippingScreeen from './screens/ShippingScreeen';
import PrivateRoute from './components/PrivateRoute';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfleUpdateScreen from './screens/ProfleUpdateScreen';
import OrderAdminScreen from './screens/admin/OrderAdminScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import AddProductScreen from './screens/admin/AddProductScreen';




const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(
  <React.StrictMode>
    <Provider store={store}> 

    
    
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<App/>}>
          <Route index={true} path='/' element={<Homescreen/>}/>
          <Route path='/product/:id' element={<ProductScreen/>}/>
          <Route path='/cart' element={<CartScreen/>}/>
          <Route path='/login' element={<LoginScreen/>}/>
          <Route path='/register' element={<Registration/>}/>
          

          

          <Route path='' element={<PrivateRoute/>}>
          <Route path='/shipping' element={<ShippingScreeen/>}/>
          <Route path='/payment' element={<PaymentScreen/>}/>
          <Route path='/orderplace' element={<PlaceOrderScreen/>}/>
          <Route path='/order/:id' element={<OrderScreen/>}/>
          <Route path='/profile' element={<ProfleUpdateScreen/>}/>
          

          </Route>

            {/* Admin Routes start here */}
          <Route path='' element={<AdminRoute/>}>

          <Route path='/admin/orderlist' element={<OrderAdminScreen/>}/>
          <Route path='/admin/productlist' element={<ProductListScreen/>}/>
          <Route path='/admin/product/:id/edit' element={<ProductEditScreen/>}/>
          <Route path='/admin/addproduct' element={<AddProductScreen/>}/>
          


          </Route>


          </Route>

        
        
      </Routes>
    </BrowserRouter>
    
    </Provider>

  </React.StrictMode> 
);

