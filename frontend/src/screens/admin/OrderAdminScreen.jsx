import React from 'react'
import { useGetallOrdersQuery } from '../../slices/OrderApiSlice';
import { Table ,Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { LinkContainer } from 'react-router-bootstrap';


const OrderAdminScreen = () => {
    const {data:allOrders ,isLoading ,error} =useGetallOrdersQuery()

    if(error){
        console.log(error)
    }
    if(allOrders){
        console.log(allOrders)
    }
  return (
    <>
    <h1>Orders</h1>
    {isLoading?<Loader/>: error? <Message variant='danger'>{error}</Message>:(
        <Table striped hover responsive className='table-sm'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>USER</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {allOrders.map((item) =>(
                    <tr key={item._id}>
                        <td>{item._id}</td>
                        <td>{item.user && item.user.name}</td>
                        <td>{item.createdAt}</td>
                        <td>{item.totalPrice}</td>
                        <td>{item.isPaid?(item.paidAt.substring(0,10)):(<FaTimes style={{color:'red'}}/>)}</td>

                        <td>{item.isDelivered ? (item.deliveredAt.substring(0, 10)) : (<FaTimes style={{ color: 'red' }} />)}</td>
                        
                    
                        <td>
                            <LinkContainer to={`/order/${item._id}`}>
                                <Button variant='light' className='btn-sm'>Details</Button>
                            </LinkContainer>
                        </td>
                        

                    </tr>
                ))}
            </tbody>

        </Table>
    )}
    </>
  )
}

export default OrderAdminScreen ;