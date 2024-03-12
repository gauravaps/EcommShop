import {configureStore} from '@reduxjs/toolkit'
import { ApiSlices } from './slices/ApiSlices';
import CartSlice from './slices/CartSlice';
import authSlice from './slices/authSlice';

const store= configureStore({
    reducer:{
        [ApiSlices.reducerPath]:ApiSlices.reducer,
        cart:CartSlice,
        auth:authSlice,

    },

    middleware:(getdefaultMiddleware)=>
        getdefaultMiddleware().concat(ApiSlices.middleware)

    ,

    devTools:true,


})

export default store;