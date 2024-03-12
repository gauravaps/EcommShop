import {configureStore} from '@reduxjs/toolkit'
import { ApiSlices } from './slices/ApiSlices';
import CartSlice from './slices/CartSlice';

const store= configureStore({
    reducer:{
        [ApiSlices.reducerPath]:ApiSlices.reducer,
        cart:CartSlice,

    },

    middleware:(getdefaultMiddleware)=>
        getdefaultMiddleware().concat(ApiSlices.middleware)

    ,

    devTools:true,


})

export default store;