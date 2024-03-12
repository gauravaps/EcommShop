import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'

import { BASE_URL } from '../constant'

const baseQuery= fetchBaseQuery({
    baseurl:BASE_URL

})

export const ApiSlices = createApi({
    baseQuery,

    tagTypes:['product','order','user'],

    endpoints:(builder) =>({})

})

