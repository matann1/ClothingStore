import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listProductDetails, updateProduct } from "../actions/productActions";
import {
  Button,
  Card,
  TextField,
  Stack,
  FormGroup,
  FormControl,
} from "@mui/material";

const ProductEditPage = () => {
  const { id: productId } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [season, setSeason] = useState("");
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: "PRODUCT_UPDATE_RESET" });
      navigate("/admin/productlist");
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
        setSeason(product.season);
      }
    }
  }, [navigate, dispatch, product, productId, successUpdate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post("/api/upload", formData, config);

      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
        season,
      })
    );
  };

  return (
    <>
      <Button
        onClick={() => navigate("/admin/productlist")}
        variant="contained"
        sx={{ backgroundColor: "black", margin: "4%" }}
      >
        Back
      </Button>
      <Card
        sx={{
          marginTop: "2%",
          textAlign: "center",
        }}
      >
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message error={errorUpdate}></Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message error={error}></Message>
        ) : (
          <FormControl>
            <form onSubmit={submitHandler}>
              <Stack spacing={2}>
                <FormGroup controlid="name">
                  <TextField
                    sx={{ marginTop: "10%" }}
                    label="Enter name"
                    type="text"
                    value={name}
                    required
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormGroup>

                <FormGroup controlid="price">
                  <TextField
                    sx={{ marginTop: "10%" }}
                    label="Enter price"
                    type="number"
                    value={price}
                    required
                    name="price"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </FormGroup>

                <FormGroup controlid="image">
                  <TextField
                    sx={{ marginTop: "10%" }}
                    label="Enter image URL"
                    type="text"
                    value={image}
                    required
                    name="image"
                    onChange={(e) => setImage(e.target.value)}
                  />
                  <TextField
                    sx={{ marginTop: "10%" }}
                    type="file"
                    custom
                    onChange={uploadFileHandler}
                  />
                  {uploading && <Loader />}
                </FormGroup>

                <FormGroup controlid="brand">
                  <TextField
                    sx={{ marginTop: "10%" }}
                    label="Enter brand"
                    type="text"
                    value={brand}
                    required
                    name="brand"
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </FormGroup>

                <FormGroup controlid="countInStock">
                  <TextField
                    sx={{ marginTop: "10%" }}
                    label="Enter countInStock"
                    type="numbet"
                    value={countInStock}
                    required
                    name="countInStock"
                    onChange={(e) => setCountInStock(e.target.value)}
                  />
                </FormGroup>

                <FormGroup controlid="category">
                  <TextField
                    sx={{ marginTop: "10%" }}
                    label="Enter category"
                    type="text"
                    value={category}
                    required
                    name="category"
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </FormGroup>

                <FormGroup controlid="description">
                  <TextField
                    sx={{ marginTop: "10%" }}
                    label="Enter description"
                    type="text"
                    value={description}
                    required
                    name="description"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </FormGroup>

                <FormGroup controlid="season">
                  <TextField
                    sx={{ marginTop: "10%" }}
                    label="Enter season"
                    type="text"
                    value={season}
                    required
                    name="season"
                    onChange={(e) => setSeason(e.target.value)}
                  />
                </FormGroup>
              </Stack>
              <Button
                variant="contained"
                sx={{ backgroundColor: "black", margin: "4%" }}
                type="submit"
              >
                Update
              </Button>
            </form>
          </FormControl>
        )}
      </Card>
    </>
  );
};

export default ProductEditPage;
