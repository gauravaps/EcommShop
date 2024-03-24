import { PRODUCTS_URL } from "../constant";
import { ApiSlices } from "./ApiSlices";
import { ADMINPRO_URL } from "../constant";
import { UPLOAD_URL } from "../constant";


export const ProductApiSlice =ApiSlices.injectEndpoints({

    endpoints:(builder)=>({

        getproducts:builder.query({
            query:()=>({
                url:PRODUCTS_URL,
                
            }), 
            
            keepUnusedDataFor:5,
            providesTags:['products'],
        }),

        getsingleProduct:builder.query({
            query:(productId)=>({
                url:`${PRODUCTS_URL}/${productId}`
            }),
            keepUnusedDataFor:5
        }),

        addproduct:builder.mutation({

            query:() =>({
                url:`${ADMINPRO_URL}/addproduct`,
                method:'POST',

            }),
           invalidatesTags:['product'],
        }),

        editProduct:builder.mutation({
            query:(data ) =>({
                url:`${ADMINPRO_URL}/${data._id}`,
                method:'PUT',
                body:data,
            }),
            invalidatesTags:['products'],
        }),
        uploadProductImage:builder.mutation({
            query:(data) =>({
                url:`${UPLOAD_URL}`,
                method:'POST',
                body:data,
            }),
        }),


    }),
});

 export const {useGetproductsQuery ,useGetsingleProductQuery ,
    useAddproductMutation ,useEditProductMutation , useUploadProductImageMutation} =ProductApiSlice; 