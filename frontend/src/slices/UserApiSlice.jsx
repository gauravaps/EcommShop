import { USERS_URL } from "../constant";
import { ApiSlices } from "./ApiSlices";

const UserApiSlice =ApiSlices.injectEndpoints({

    endpoints:(builder)=>({
        login:builder.mutation({
            query:(data) =>({
                url:`${USERS_URL}/auth`,
                method:'post',
                body:data,

            }),
        }),
        registration:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/register`,
                method:'post',
                body:data,

            }),
        }),

        logoutuser:builder.mutation({
            query:() =>({
                url:`${USERS_URL}/logout`,
                method:'post', 
            }),

        }),

        profileUpdate:builder.mutation({
            query:(data) =>({
                url:`${USERS_URL}/update`,
                method:'PUT',
                body:data,
            }),
        }),
        getusers:builder.query({
            query:() =>({
                url:`${USERS_URL}/getusers`,

            }),
            providesTags:['users'],
            keepUnusedDataFor:5,
        }),
        
        deleteuser:builder.mutation({
            query:(userId)=>({
                url:`${USERS_URL}/delete/${userId}`,
                method:'DELETE',

            }),
        }),
        getUserDetails:builder.query({
            query:(userId) =>({
                url:`${USERS_URL}/getuserbyid/${userId}`,
            }),
            keepUnusedDataFor:5,
        }),

        updateUser:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/updateuserbyid/${data.userId}`,
                method:'PUT',
                body:data,
            }),
            invalidatesTags:['Users'],
        })
    })
});

export const {useLoginMutation ,useRegistrationMutation ,
    useLogoutuserMutation ,useProfileUpdateMutation,
    useGetusersQuery,useDeleteuserMutation,
    useGetUserDetailsQuery ,useUpdateUserMutation
} =UserApiSlice;