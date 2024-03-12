import React from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useGetproductsQuery } from "../slices/ProductApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

const Homescreen = () => {
  const { data: product, error, isLoading } = useGetproductsQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          {product && (
            <>
              <h1>Latest products</h1>
              <Row>
                {product.map((prod) => (
                  <Col key={prod._id} sm={12} md={6} lg={4} xl={3}>
                    <Product prod={prod} />
                  </Col>
                ))}
              </Row>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Homescreen;
