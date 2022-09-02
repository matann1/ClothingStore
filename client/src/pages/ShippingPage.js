import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  TextField,
  Stack,
  FormControl,
  FormGroup,
} from "@mui/material";
import { saveShippingAddress } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";

const ShippingPage = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };

  return (
    <Card
      sx={{
        marginTop: "2%",
        textAlign: "center",
      }}
    >
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <FormControl>
        <form onSubmit={submitHandler}>
          <Stack spacing={2}>
            <FormGroup controlid="address">
              <TextField
                sx={{ marginTop: "10%" }}
                label="Enter Address"
                type="text"
                value={address}
                required
                name="address"
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormGroup>
            <FormGroup controlid="city">
              <TextField
                label="Enter City"
                type="text"
                value={city}
                required
                name="city"
                onChange={(e) => setCity(e.target.value)}
              />
            </FormGroup>
            <FormGroup controlid="postalCode">
              <TextField
                label="Enter postal code"
                type="text"
                value={postalCode}
                required
                name="postalCode"
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </FormGroup>
            <FormGroup controlid="country">
              <TextField
                label="Enter country"
                type="text"
                value={country}
                required
                name="country"
                onChange={(e) => setCountry(e.target.value)}
              />
            </FormGroup>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "black",

                marginBottom: "10%",
              }}
              type="submit"
            >
              Continue
            </Button>
          </Stack>
        </form>
      </FormControl>
    </Card>
  );
};

export default ShippingPage;
