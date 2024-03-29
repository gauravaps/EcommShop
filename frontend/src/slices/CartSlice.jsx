import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/CartUtils";



const initialState =localStorage.getItem('cart')? JSON.parse(localStorage.getItem('cart')):{cartItem:[] 
    ,shippingAdress:{} ,paymentMethod:'paypal'}

export const addDecimal =(num) =>{
    
    return (Math.round(num*100) / 100).toFixed(2)
    //return num.toFixed(2)
}

const CartSlice=createSlice({
    name:'cart',
    initialState,
    reducers:{
        addToCart:(state ,action)=>{
            let item =action.payload ;

            let existItem  = state.cartItem.find((x) => x._id === item._id)


            if(existItem){
                state.cartItem =state.cartItem.map((x) =>x._id === existItem._id ? item:x)
            }else{
                state.cartItem=[...state.cartItem ,item]
            } 
            
           return updateCart(state)

        },
        
        removeCart:(state ,action) =>{
            state.cartItem=state.cartItem.filter((x)=> x._id !== action.payload)
            return updateCart(state)
        },
        saveShippingAddress:(state ,action) =>{
            state.shippingAdress =action.payload
            return updateCart(state)
        },

        savePaymentMethod:(state , action) =>{
            state.paymentMethod =action.payload
            return updateCart(state)
        },

        clearCartItem:(state) =>{
            state.cartItem =[]
            return updateCart(state)
        }
        
        
    

    },
       
})

export const{addToCart , removeCart ,saveShippingAddress ,savePaymentMethod ,clearCartItem } =CartSlice.actions;
export default CartSlice.reducer;