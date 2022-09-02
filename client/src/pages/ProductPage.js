import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  FormControl,
  FormGroup,
  Grid,
  InputLabel,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Rating from "../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import {
  listProductDetails,
  createProductReview,
} from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Box } from "@mui/system";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      alert("Review Submitted!");
      setRating(0);
      setComment("");
      dispatch(listProductDetails(id));
      dispatch({ type: "PRODUCT_CREATE_REVIEW_RESET" });
    }
    if (!product._id || product._id !== id) {
      dispatch(listProductDetails(id));
      dispatch({ type: "PRODUCT_CREATE_REVIEW_RESET" });
    }
  }, [dispatch, id, successProductReview, errorProductReview, product]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(id, { rating, comment }));
    dispatch({ type: "PRODUCT_CREATE_REVIEW_RESET" });
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{ backgroundColor: "black", margin: "4%" }}
        onClick={() => navigate("/")}
      >
        Go Back
      </Button>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message error={error}></Message>
      ) : (
        <Grid container spacing={2} sx={{ maxWidth: 700 }}>
          <Grid item xs={6} md={8}>
            <CardMedia
              component="img"
              image={product.image}
              alt={product.name}
            />
          </Grid>
          <Grid item xs={4}>
            <h2>{product.name}</h2>
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />
            <h3>${product.price}</h3>
            Description: {product.description}
          </Grid>
          <Grid item xs={6} md={4}>
            <Card sx={{ minWidth: 400 }}>
              <CardContent>
                <Typography sx={{ fontSize: 16, margin: "3%" }}>
                  Status:{" "}
                  {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                </Typography>
                {product.countInStock > 0 && (
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Qty</InputLabel>
                      <Select
                        value={qty}
                        label="Qty"
                        onChange={(e) => setQty(e.target.value)}
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <MenuItem key={x + 1} value={x + 1}>
                            {x + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}
                <Button
                  onClick={addToCartHandler}
                  variant="contained"
                  sx={{ backgroundColor: "black", margin: "5%" }}
                  disabled={product.countInStock === 0}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 400 }}>
              <CardContent>
                <Typography sx={{ fontSize: 16, margin: "3%" }}>
                  <h2>Reviews</h2>
                  {product.reviews.length === 0 && <h3>Not Reviews</h3>}
                </Typography>
                {product.reviews.map((review) => (
                  <ListItemAvatar key={review._id}>
                    <ListItemText>
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} />
                      <p>{review.createdAt.substring(0, 10)}</p>
                      <p>{review.comment}</p>
                    </ListItemText>
                    <Divider sx={{ my: 1.5 }} />
                  </ListItemAvatar>
                ))}

                <h2>Write a Customer Review</h2>
                {successProductReview && <h3>Review submitted successfully</h3>}

                {loadingProductReview && <Loader />}

                {errorProductReview && (
                  <Message error={errorProductReview}></Message>
                )}

                {userInfo ? (
                  <FormControl>
                    <form onSubmit={submitHandler}>
                      <Box sx={{ minWidth: 120 }}>
                        <FormGroup fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Rating
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={rating}
                            label="rating"
                            onChange={(e) => setRating(e.target.value)}
                          >
                            <MenuItem value={1}>Poor</MenuItem>
                            <MenuItem value={2}>Fair</MenuItem>
                            <MenuItem value={4}>Good</MenuItem>
                            <MenuItem value={5}>Very Good</MenuItem>
                            <MenuItem value={5}>Excellent</MenuItem>
                          </Select>
                        </FormGroup>
                      </Box>
                      <FormGroup controlId="comment">
                        <TextField
                          sx={{ marginTop: "10%" }}
                          label="Enter comment"
                          type="textarea"
                          value={comment}
                          name="comment"
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </FormGroup>

                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "black", margin: "4%" }}
                        type="submit"
                      >
                        Submit
                      </Button>
                    </form>
                  </FormControl>
                ) : (
                  <h4>
                    Please
                    <Link to="/login">&nbsp;sign in</Link> to write a review
                  </h4>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default ProductPage;
