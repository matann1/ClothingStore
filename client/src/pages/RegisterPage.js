import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { register } from "../actions/userActions";
import { Button, Card, Grid, TextField, Stack } from "@mui/material";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [registerErrors, setRegisterErrors] = useState({});
  const [fieldRegister, setFieldRegister] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  const redirect = window.location.search
    ? window.location.search.split("=")[1]
    : "/";

  useEffect(() => {
    validate(name, email, password, confirmPassword);
    if (userInfo) {
      navigate(redirect);
    }
  }, [
    navigate,
    dispatch,
    fieldRegister,
    userInfo,
    registerErrors,
    redirect,
    name,
    email,
    password,
    confirmPassword,
  ]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setRegisterErrors(validate(name, email, password, confirmPassword));
    if (!fieldRegister) {
      if (password !== confirmPassword) {
        setMessage("Passwords do not match");
        setFieldRegister(false);
      } else {
        // setFieldRegister(true);
        dispatch(register(name, email, password));
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
        <h1>Sign Up</h1>
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
          </Stack>
          <Button
            variant="contained"
            sx={{ backgroundColor: "black", margin: "4%" }}
            type="submit"
          >
            Register
          </Button>
          <Grid>
            Have an Account?{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
              Login
            </Link>
          </Grid>
        </form>
      </Card>
    </>
  );
};

export default RegisterPage;
