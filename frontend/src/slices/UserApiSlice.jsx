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
    })
});

export const {useLoginMutation} =UserApiSlice;