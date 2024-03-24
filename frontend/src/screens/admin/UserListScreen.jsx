import React from 'react'

import { Table ,Button } from 'react-bootstrap';
import { FaTimes ,FaTrash ,FaEdit,FaCheck } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { LinkContainer } from 'react-router-bootstrap';
import { useGetusersQuery ,useDeleteuserMutation} from '../../slices/UserApiSlice';
import { toast } from 'react-toastify';


const UserListScreen = () => {
    const {data:users ,isLoading ,error ,refetch} =useGetusersQuery()
    const [deleteuser ,{isLoading:loadingDelete}] =useDeleteuserMutation()

    
    const deleteHandler = async(id) =>{

        if(window.confirm('are you sure want to delete this user')){

            try {
                await deleteuser(id);
                
                refetch();
                toast.success('User deleted');
                
            } catch (err) {
                toast.error(err?.data?.Message || err.error);

                
            }
        }
    }

  return (
    <>
    <h1>Users</h1>
    {loadingDelete && <Loader/>}
    {isLoading?<Loader/>: error? <Message variant='danger'>{error}</Message>:(
        <Table striped hover responsive className='table-sm'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>ADMIN</th>
                    
                
                </tr>
            </thead>
            <tbody>
                {users.map((user) =>(
                    <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        {/* <td>{user.email}</td> */}
                        <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                        <td>{user.isAdmin ?(<FaCheck style={{color:'green'}}/>):(<FaTimes style={{color:'red'}}/>)}</td>

                        
                    
                        <td>
                            <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                <Button variant='light' className='btn-sm'> <FaEdit/> </Button>
                            </LinkContainer>

                            <Button variant='dander' className='btn-sm' onClick={() =>deleteHandler(user._id)}>
                                <FaTrash style={{color:'red'}}/>

                            </Button>
                        </td>
                        

                    </tr>
                ))}
            </tbody>

        </Table>
    )}
    </>
  )
}



export default UserListScreen;




