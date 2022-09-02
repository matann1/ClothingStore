import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Divider, ListItemAvatar, Avatar, Button } from "@mui/material";
import { PayPalButton } from "react-paypal-button-v2";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const OrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: orderId } = useParams();

  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  if (!loading) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    if (!order || successPay || successDeliver) {
      dispatch({ type: "ORDER_PAY_RESET" });
      dispatch({ type: "ORDER_DELIVER_RESET" });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [
    dispatch,
    navigate,
    userInfo,
    order,
    orderId,
    successPay,
    successDeliver,
  ]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message error={error}></Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <List sx={{ width: "100%", maxWidth: 450, bgcolor: "background.paper" }}>
        <ListItem>
          <p>
            <ListItemText primary="Shipping" secondary="Address:" />
            {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
          {order.isDelivered ? (
            <h4 style={{ color: "green" }}>
              Delivered on {order.deliveredAt.substring(0, 10)}
            </h4>
          ) : (
            <h4 style={{ color: "red" }}>Not Delivered</h4>
          )}
        </ListItem>
        <ListItem>
          <strong> Name: {order.user.name}</strong>
        </ListItem>
        <ListItem>
          <strong>
            {" "}
            <a href={`mailto:${order.user.email}`}>Email: {order.user.email}</a>
          </strong>
        </ListItem>
        <Divider sx={{ my: 0.5 }} />
        <ListItem>
          <p>
            <ListItemText primary="Payment Method" secondary="Method: " />
            {order.paymentMethod}
          </p>
          {order.isPaid ? (
            <h4 style={{ color: "green" }}>Paid on {order.isPaid}</h4>
          ) : (
            <h4 style={{ color: "red" }}>Not Paid</h4>
          )}
        </ListItem>
        <Divider sx={{ my: 0.5 }} />
        <ListItem>
          <ListItemText />
          {order.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              <h3>Order Items</h3>
              {order.orderItems.map((item, index) => (
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
            {order.itemsPrice}
          </Typography>
          <Divider sx={{ my: 0.5 }} />
          <Typography
            sx={{ mb: 1.5, display: "flex", justifyContent: "space-between" }}
          >
            Shipping &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $ {order.shippingPrice}
          </Typography>
          <Divider sx={{ my: 0.5 }} />
          <Typography sx={{ mb: 1.5 }}>
            Tax
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            $ {order.taxPrice}
          </Typography>
          <Divider sx={{ my: 0.5 }} />
          <Typography sx={{ mb: 1.5 }}>
            Total
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${" "}
            {order.totalPrice}
          </Typography>
          <Divider sx={{ my: 0.5 }} />
          {!order.isPaid && (
            <Typography>
              {loadingPay && <Loader />}
              {!sdkReady ? (
                <Loader />
              ) : (
                <PayPalButton
                  amount={order.totalPrice}
                  onSuccess={successPaymentHandler}
                />
              )}
            </Typography>
          )}
          {loadingDeliver && <Loader />}
          {userInfo && userInfo.admin && order.isPaid && !order.isDelivered && (
            <Button
              variant="contained"
              sx={{ backgroundColor: "black", marginTop: "1%" }}
              onClick={deliverHandler}
            >
              Mark As Deliverd
            </Button>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default OrderPage;
