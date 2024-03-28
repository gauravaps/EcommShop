import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useGetproductsQuery } from '../slices/ProductApiSlice';
import Homescreen from '../screens/Homescreen';

const SearchProduct = () => {
    const [searchProduct, setSearchProduct] = useState('');
    const { data: product, error, isLoading } = useGetproductsQuery();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('product');
    };

    const filteredProducts = product && product.filter(products =>
        products.name.toLowerCase().includes(searchProduct.toLowerCase())
    );

    return (
        <>
            <Homescreen filteredProducts={filteredProducts} isLoading={isLoading} error={error} />
            <Form onSubmit={handleSubmit} className='d-flex'>
                <Form.Control
                    type='text'
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    placeholder='Search product...'
                    className='mr-sm-2 ml-sm-5'
                ></Form.Control>
                <Button type='submit' variant='outline-light' className='p-2 mx-2'>
                    Search
                </Button>
            </Form>
        </>
    );
};

//export default SearchProduct;
