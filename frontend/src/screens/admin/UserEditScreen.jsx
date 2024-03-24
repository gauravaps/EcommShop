import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FormContainer } from '../../components/FormContainer';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../slices/UserApiSlice';

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const { data: user, refetch, error, isLoading } = useGetUserDetailsQuery(userId);
  const [updateUser, { isLoading: loadingUpdateUser }] = useUpdateUserMutation();
  console.log(userId)

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);


  // Edit product handler   
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
        const userUpdate ={
            _id:userId ,name ,email ,isAdmin
        }
        
        await updateUser(userUpdate)

        toast.success('User updated successfully')
        refetch()
        navigate('/admin/userlist')

        
        
    } catch (err) {

        toast.error(err?.data?.Message || err.error)
        
    }
  };

  return (
    <>
      <Link to={'/admin/userlist'} className='btn btn-light my-3'>Go Back</Link>

      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdateUser && <Loader />}

        {isLoading ? (<Loader />) : error ? (<Message variant='danger'>{error}</Message>) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' className='my-2'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='email' className='my-2'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='isAdmin' className='my-2'>
              <Form.Check
                type='checkbox'
                label='Is Admin'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type='submit' variant='primary' className='my-2'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
