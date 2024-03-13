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
    })
});

export const {useLoginMutation ,useRegistrationMutation ,useLogoutuserMutation} =UserApiSlice;