import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { Grid } from "@mui/material";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listProducts } from "../actions/productActions";
import SearchByLocation from "../components/SearchByLocation";

import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const HomePage = () => {
  const { keyword } = useParams();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [searchLocationProducts, setSearchLocationProducts] = useState([]);

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const findProduct = () => {
    console.log(products);
    console.log(searchLocationProducts);
    if (Number(state) >= 25) {
      setSearchLocationProducts(
        products.filter((product) => product.season === "summer")
      );
    } else if (Number(state) <= 14) {
      setSearchLocationProducts(
        products.filter((product) => product.season === "winter")
      );
    } else {
      setSearchLocationProducts(
        products.filter((product) => product.season === "transition")
      );
    }
  };

  useEffect(() => {
    // debugger;

    console.log(state);
    console.log(products);
    if (state) {
      findProduct();
      // dispatch(listProducts(keyword));
    } else {
      dispatch(listProducts(keyword));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, keyword, state]);

  return (
    <>
      <h1>List Products</h1>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Enter for search by live location weather
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <SearchByLocation />
        </Typography>
        {state && (
          <Typography sx={{ mb: 1.5 }} variant="body1">
            The temperature in your Location is: {state}°C
            <h3>Our recommendation:</h3>
          </Typography>
        )}
      </CardContent>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message error={error}></Message>
      ) : (
        <>
          {state ? (
            <Grid container={true} spacing={2}>
              {searchLocationProducts.map((product) => (
                <Grid
                  key={product._id}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={4}
                  xl={3}
                >
                  <Product product={product} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container={true} spacing={2}>
              {products.map((product) => (
                <Grid
                  key={product._id}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={4}
                  xl={3}
                >
                  <Product product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </>
  );
};

export default HomePage;
