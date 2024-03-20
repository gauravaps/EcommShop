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

        getmyOrders:builder.query({
            query:() =>({
                url:`${ORDERS_URL}/myorders`,

                
            }),
            keepUnusedDataFor:5,
        }),

        getallOrders:builder.query({
            query:() =>({
                url:`${ORDERS_URL}/getallorders`,
            }),
            keepUnusedDataFor:5,

        }),

        deliveredOrder:builder.mutation({
            query:(orderId)=>({
                url:`${ORDERS_URL}/${orderId}/deliver`,
                method:'PUT',
            })
        })

    }),
})

export const {useCreateOrderMutation , useGetOrderByIdQuery ,
    usePayOrderMutation,useGetPaypalClientIdQuery ,
    useGetmyOrdersQuery ,useGetallOrdersQuery ,useDeliveredOrderMutation} =OrderApiSlice; 