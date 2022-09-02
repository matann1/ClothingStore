import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import Rating from "./Rating";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
  return (
    <Card sx={{ maxWidth: 220, height: "100%" }}>
      <Link to={`/product/${product._id}`}>
        <CardMedia component="img" height="300" image={product.image} />
      </Link>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          <Link
            to={`/product/${product._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {product.name}
          </Link>
        </Typography>
        <Typography variant="h7" color="text.secondary">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Typography>
        <Typography variant="h6" fontWeight="bold" color="black">
          ${product.price}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Product;
