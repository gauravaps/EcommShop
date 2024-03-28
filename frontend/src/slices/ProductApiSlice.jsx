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
        deleteProduct:builder.mutation({
            query:(productId) =>({
                url:`${ADMINPRO_URL}/delete/${productId}`,
                method:"DELETE",
                
            }),
        }),

        createReview:builder.mutation({
            query:(data) => ({
                url:`${ADMINPRO_URL}/${data._id}/review`,
                method:'POST',
                body:data,
            }),
            invalidatesTags:['product'],
        }),

        getTopproducts:builder.query({
            query:() =>({
                url:`${ADMINPRO_URL}/topproduct`,
            }),
            keepUnusedDataFor:5,
        }),


    }),
});

 export const {useGetproductsQuery ,useGetsingleProductQuery ,
             useAddproductMutation ,useEditProductMutation ,
            useUploadProductImageMutation , useDeleteProductMutation ,
            useCreateReviewMutation ,useGetTopproductsQuery} =ProductApiSlice; 