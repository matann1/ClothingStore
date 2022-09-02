import React from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from "@mui/material";
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../actions/productActions";

const ProductListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadigCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: "PRODUCT_CREATE_RESET" });

    if (!userInfo.admin) {
      navigate("/login");
    }
    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts());
    }
  }, [
    dispatch,
    navigate,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <>
      <h1>Products </h1>
      <Button
        variant="contained"
        sx={{ backgroundColor: "black", marginBottom: "1%" }}
        onClick={createProductHandler}
      >
        <FontAwesomeIcon icon={faPlus} /> &nbsp; Create Product
      </Button>
      {loadingDelete && <Loader />}
      {errorDelete && <Message error={errorDelete}></Message>}
      {loadigCreate && <Loader />}
      {errorCreate && <Message error={errorCreate}></Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message error={error}></Message>
      ) : (
        <TableContainer sx={{ maxHeight: 700 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableCell>ID</TableCell>
              <TableCell>NAME</TableCell>
              <TableCell>PRICE</TableCell>
              <TableCell>CATEGORY</TableCell>
              <TableCell>BRAND</TableCell>
              <TableCell></TableCell>
            </TableHead>
            <TableBody>
              {products &&
                products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product._id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <Link to={`/admin/product/${product._id}/edit`}>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "black", marginTop: "4%" }}
                      >
                        <FontAwesomeIcon icon={faEdit} /> &nbsp; EDIT
                      </Button>
                    </Link>
                    &nbsp;
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "black", marginTop: "4%" }}
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> &nbsp;
                    </Button>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default ProductListPage;
