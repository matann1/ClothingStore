import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Divider, ListItemAvatar, Avatar } from "@mui/material";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import { createOrder } from "../actions/orderActions";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const PlaceOrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
  cart.taxPrice = addDecimals((0.15 * cart.itemsPrice).toFixed(2));
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`);
    }
    // eslint-disable-next-line
  }, [navigate, success]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  return (
    <>
      <CheckoutSteps
        sx={{
          marginTop: "2%",
          textAlign: "center",
        }}
        step1
        step2
        step3
        step4
      />
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        <ListItem>
          <ListItemText primary="Shipping" secondary="Address:" />
          {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
          {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
        </ListItem>
        <Divider sx={{ my: 0.5 }} />
        <ListItem>
          <ListItemText primary="Payment Method" secondary="Method: " />
          {cart.paymentMethod.paymentMethod}
        </ListItem>
        <Divider sx={{ my: 0.5 }} />
        <ListItem>
          <ListItemText />
          {cart.cartItems.length === 0 ? (
            <Message>Your cart is empty</Message>
          ) : (
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              <h3>Order Items</h3>
              {cart.cartItems.map((item, index) => (
                <ListItemAvatar key={index}>
                  <Avatar
                    sx={{ width: 150, height: 150 }}
                    alt={item.name}
                    src={item.image}
                  />
                  <ListItemText>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </ListItemText>
                  <ListItemText>
                    {item.qty} x ${item.price} = ${item.qty * item.price}
                  </ListItemText>
                  <Divider sx={{ my: 1.5 }} />
                </ListItemAvatar>
              ))}
            </List>
          )}
        </ListItem>
      </List>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 30 }} color="text.secondary" gutterBottom>
            Order Summary
          </Typography>
          <Typography variant="h5" component="div"></Typography>
          <Divider sx={{ my: 0.5 }} />
          <Typography sx={{ mb: 1.5 }}>
            Items &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${" "}
            {cart.itemsPrice}
          </Typography>
          <Divider sx={{ my: 0.5 }} />
          <Typography
            sx={{ mb: 1.5, display: "flex", justifyContent: "space-between" }}
          >
            Shipping &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $ {cart.shippingPrice}
          </Typography>
          <Divider sx={{ my: 0.5 }} />
          <Typography sx={{ mb: 1.5 }}>
            Tax
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            $ {cart.taxPrice}
          </Typography>
          <Divider sx={{ my: 0.5 }} />
          <Typography sx={{ mb: 1.5 }}>
            Total
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${" "}
            {cart.totalPrice}
          </Typography>
          <Divider sx={{ my: 0.5 }} />
          <Typography>{error && <Message error={error}></Message>}</Typography>
        </CardContent>
        <CardActions>
          <Button
            type="button"
            disabled={cart.cartItems === 0}
            onClick={placeOrderHandler}
            size="small"
            variant="contained"
            sx={{
              backgroundColor: "black",
            }}
          >
            Place Order
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default PlaceOrderPage;
