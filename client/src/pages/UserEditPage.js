import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getUserDetails, updateUser } from "../actions/userActions";
import {
  Button,
  Card,
  TextField,
  Stack,
  FormControlLabel,
  FormGroup,
  FormControl,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";

const UserEditPage = () => {
  const { id: userId } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [admin, setAdmin] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: "USER_UPDATE_RESET" });
      navigate("/admin/userlist");
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setAdmin(user.admin);
      }
    }
  }, [navigate, dispatch, user, userId, successUpdate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: userId, name, email, admin }));
  };

  return (
    <>
      <Button
        onClick={() => navigate("/admin/userlist")}
        variant="contained"
        sx={{ backgroundColor: "black", margin: "4%" }}
      >
        Back
      </Button>
      <Card
        sx={{
          marginTop: "2%",
          textAlign: "center",
        }}
      >
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message error={errorUpdate}></Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message error={error}></Message>
        ) : (
          <FormControl>
            <form onSubmit={submitHandler}>
              <Stack spacing={2}>
                <FormGroup controlid="name">
                  <TextField
                    sx={{ marginTop: "10%" }}
                    label="Enter name"
                    type="text"
                    value={name}
                    required
                    name="address"
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormGroup>

                <FormGroup controlid="email">
                  <TextField
                    sx={{ marginTop: "10%" }}
                    label="Enter email"
                    type="email"
                    value={email}
                    required
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormGroup>

                <FormGroup controlid="admin">
                  <FormControlLabel
                    label="Is Admin"
                    control={<Checkbox checked={admin} />}
                    onChange={(e) => setAdmin(e.target.checked)}
                  />
                </FormGroup>
              </Stack>
              <Button
                variant="contained"
                sx={{ backgroundColor: "black", margin: "4%" }}
                type="submit"
              >
                Update
              </Button>
            </form>
          </FormControl>
        )}
      </Card>
    </>
  );
};

export default UserEditPage;
