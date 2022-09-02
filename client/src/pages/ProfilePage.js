import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { myListOrders } from "../actions/orderActions";
import { Button, Card, Grid, TextField, Stack, Box } from "@mui/material";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [registerErrors, setRegisterErrors] = useState({});
  const [fieldRegister, setFieldRegister] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderMyList = useSelector((state) => state.orderMyList);
  const { loading: loadingOrders, error: errorOrders, orders } = orderMyList;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: "USER_UPDATE_PROFILE_RESET" });
        dispatch(getUserDetails("profile"));
        dispatch(myListOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, navigate, orders, success, user, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setRegisterErrors(validate(name, email, password, confirmPassword));
    if (!fieldRegister) {
      if (password !== confirmPassword) {
        setMessage("Passwords do not match");
        setFieldRegister(false);
      } else {
        dispatch(updateUserProfile({ id: user._id, name, email, password }));
      }
    }
  };

  const validate = (name, email, password, confirmPassword) => {
    const errors = {};
    const regex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;

    if (!name) {
      errors.name = "Name is required!";
    }
    if (!email) {
      errors.email = "Email is required!";
    } else if (!regex.test(email)) {
      errors.email = "This is not a valid email format!";
    }

    if (!password) {
      errors.password = "Password is required!";
    } else if (password.length < 5) {
      errors.password = "Password must be more than 5 characters!";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Password is required!";
    } else if (confirmPassword.length < 5) {
      errors.confirmPassword = "Password must be more than 5 characters!";
    }

    return errors;
  };
  return (
    <>
      <Card
        sx={{
          marginTop: "2%",
          textAlign: "center",
        }}
      >
        <Grid>
          <h2>User Profile</h2>
          {error && <Message error={error}></Message>}
          {message && <Message error={message}></Message>}
          {loading && <Loader />}
          <form onSubmit={submitHandler}>
            <Stack spacing={2}>
              <Grid item>
                <TextField
                  label="Enter Name"
                  type="name"
                  value={name}
                  error={registerErrors.name}
                  helperText={registerErrors.name}
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>

              <Grid item>
                <TextField
                  label="Enter Email"
                  type="email"
                  value={email}
                  error={registerErrors.email}
                  helperText={registerErrors.email}
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>

              <Grid item>
                <TextField
                  label="Enter Password"
                  type="password"
                  value={password}
                  error={registerErrors.password}
                  helperText={registerErrors.password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>

              <Grid item>
                <TextField
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  error={registerErrors.confirmPassword}
                  helperText={registerErrors.confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Grid>
              {success && (
                <Box
                  sx={{
                    color: "white",
                    backgroundColor: "green",
                    p: 1,
                    border: "2px dashed grey",
                  }}
                >
                  Update Success
                </Box>
              )}
            </Stack>

            <Button
              variant="contained"
              sx={{ backgroundColor: "black", margin: "4%" }}
              type="submit"
            >
              Update
            </Button>

            <Button
              onClick={() => navigate("/login")}
              variant="contained"
              sx={{ backgroundColor: "black", margin: "4%" }}
            >
              Back
            </Button>
            <Grid>
              {/* Have an Account?{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
              Login
            </Link> */}
            </Grid>
          </form>
        </Grid>
      </Card>
      <Grid>
        <h2>My Order</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message error={errorOrders}></Message>
        ) : (
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableCell>ID</TableCell>
                  <TableCell>DATE</TableCell>
                  <TableCell>TOTAL</TableCell>
                  <TableCell>PAID</TableCell>
                  <TableCell>DELIVERED</TableCell>
                  <TableCell></TableCell>
                </TableHead>
                <TableBody>
                  {orders &&
                    orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>{order._id}</TableCell>
                        <TableCell>
                          {order.createdAt.substring(0, 10)}
                        </TableCell>
                        <TableCell>{order.totalPrice}</TableCell>
                        <TableCell>
                          {order.isPaid ? (
                            order.paidAt.substring(0, 10)
                          ) : (
                            <FontAwesomeIcon icon={faXmark} />
                          )}
                        </TableCell>
                        <TableCell>
                          {order.isDelivered ? (
                            order.deliveredAt.substring(0, 10)
                          ) : (
                            <FontAwesomeIcon icon={faXmark} />
                          )}
                        </TableCell>
                        <Link to={`/order/${order._id}`}>
                          <Button
                            variant="contained"
                            sx={{ backgroundColor: "black", margin: "6%" }}
                          >
                            Details
                          </Button>
                        </Link>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
        <Button
          onClick={() => navigate("/login")}
          variant="contained"
          sx={{ backgroundColor: "black", margin: "4%" }}
        >
          Back
        </Button>
      </Grid>
    </>
  );
};

export default ProfilePage;
