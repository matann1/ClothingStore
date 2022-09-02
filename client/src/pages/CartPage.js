import { useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../actions/cartActions";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const CartPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const qty = Number(searchParams.get("qty"));

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (id) {
      dispatch(addToCart(id, qty));
    }
  }, [dispatch, id, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <List sx={{ width: "100%", maxWidth: 360 }}>
      <ListItem>
        <h1>Shopping Cart</h1>
      </ListItem>
      {cartItems.length === 0 ? (
        <Message error={"Your cart is empty "}></Message>
      ) : (
        <Grid container spacing={3}>
          {cartItems.map((item) => (
            <ListItem key={item.product}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    sx={{ width: 120, height: "auto" }}
                    alt="Remy Sharp"
                    src={item.image}
                  />
                </ListItemAvatar>
              </ListItem>

              <ListItem sx={{ margin: "auto" }}>${item.price}</ListItem>

              <ListItem>
                <FormControl fullWidth>
                  <InputLabel>Qty</InputLabel>
                  <Select
                    value={item.qty}
                    label="Qty"
                    onChange={(e) =>
                      dispatch(addToCart(item.product, Number(e.target.value)))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <MenuItem key={x + 1} value={x + 1}>
                        {x + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </ListItem>

              <ListItem>
                <Button
                  color="inherit"
                  onClick={() => removeFromCartHandler(item.product)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </ListItem>
            </ListItem>
          ))}
        </Grid>
      )}
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
            items
          </Typography>
          <Typography variant="body2" color="text.secondary">
            $
            {cartItems
              .reduce((acc, item) => acc + item.qty * item.price, 0)
              .toFixed(2)}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            sx={{ backgroundColor: "black" }}
            disabled={cartItems.length === 0}
            onClick={checkoutHandler}
          >
            Proceed To Checkout
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "black", margin: "1%" }}
            onClick={() => navigate("/")}
          >
            Go Back
          </Button>
        </CardActions>
      </Card>
    </List>
  );
};

export default CartPage;
