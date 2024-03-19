import { ApiSlices } from "./ApiSlices";
import { ORDERS_URL ,PAYPAL_URL } from "../constant";


 const OrderApiSlice =ApiSlices.injectEndpoints({

    endpoints:(builder) =>({
        createOrder:builder.mutation({
            query:(order)=>({
                url:`${ORDERS_URL}/addorder`,
                method:'POST',
                body:{...order} ,
            }),
        }),
        getOrderById:builder.query({
            query:(orderId) =>({
                url:`${ORDERS_URL}/${orderId}`,
                
            }),
            keepUnusedDataFor:5
        }),

        payOrder: builder.mutation({
            query: ({ orderId, details }) => ({
              url: `${ORDERS_URL}/${orderId}/pay`,
              method: 'PUT',
              body: details,
            }),
          }),

        getPaypalClientId:builder.query({
            query:() =>({
                url:PAYPAL_URL,
            }),
            keepUnusedDataFor:5
        }),

    })
})

export const {useCreateOrderMutation , useGetOrderByIdQuery ,
    usePayOrderMutation,useGetPaypalClientIdQuery} =OrderApiSlice; 