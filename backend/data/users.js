
//import bcrypt from 'bcryptjs'
import bcrypt from 'bcryptjs'

const users =[
    {
        name:'admin user',
        email:'admin@gmail.com',
        password:bcrypt.hashSync('12345',10),
        isAdmin:true,
    },

    {
        name:'gaurav patel',
        email:'gaurav@gmail.com',
        password:bcrypt.hashSync('12345',10),
        isAdmin:false,
    },

    {
        name:'toom',
        email:'toom@gmail.com',
        password:bcrypt.hashSync('12345',10),
        isAdmin:false,
    },
]

export default users;