import { PRODUCTS_URL } from "../constant";
import { ApiSlices } from "./ApiSlices";


export const ProductApiSlice =ApiSlices.injectEndpoints({

    endpoints:(builder)=>({

        getproducts:builder.query({
            query:()=>({
                url:PRODUCTS_URL,
                
            }), 
            keepUnusedDataFor:5,
        }),

        getsingleProduct:builder.query({
            query:(productId)=>({
                url:`${PRODUCTS_URL}/${productId}`
            }),
            keepUnusedDataFor:5
        })


    }),
});

 export const {useGetproductsQuery ,useGetsingleProductQuery} =ProductApiSlice;