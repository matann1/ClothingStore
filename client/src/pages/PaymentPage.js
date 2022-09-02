import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Stack, FormControl } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

import { savePaymentMethod } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";

const PaymentPage = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress) {
    navigate("/shipping");
  }
  // eslint-disable-next-line
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod({ paymentMethod }));
    navigate("/placeorder");
  };

  return (
    <Card
      sx={{
        marginTop: "2%",
        textAlign: "center",
      }}
    >
      <CheckoutSteps step1 step2 step3 />
      <h1>Patment Method</h1>
      {console.log(paymentMethod)}
      <FormControl>
        <form onSubmit={submitHandler}>
          <Stack spacing={2}>
            <FormLabel id="demo-radio-buttons-group-label">
              Select Method
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="PayPal"
              name="radio-buttons-group"
            >
              <FormControlLabel
                value="PayPal"
                control={<Radio />}
                label="PayPal"
              />
            </RadioGroup>
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

export default PaymentPage;
