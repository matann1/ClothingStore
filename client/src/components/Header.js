import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../actions/userActions";
import SearchBox from "./SearchBox";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const open2 = Boolean(anchorEl2);
  // debugger;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const logoutHandler = () => {
    dispatch(logout());
    setAnchorEl(null);
    navigate("/");
  };

  return (
    <header>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar sx={{ bgcolor: "black" }} position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
            ></IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                Clothing Store
              </Link>
            </Typography>
            <SearchBox />
            <Button color="inherit">
              <FontAwesomeIcon icon={faCartShopping} />
              <Link
                to="/cart"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                &nbsp; Cart
              </Link>
            </Button>
            {userInfo ? (
              <>
                <Button
                  id="fade-button"
                  aria-controls={open ? "fade-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  sx={{ color: "white" }}
                  // disableElevation
                  onClick={handleClick}
                >
                  {userInfo.name}
                </Button>
                <Menu
                  id="fade-menu"
                  MenuListProps={{
                    "aria-labelledby": "fade-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </MenuItem>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="inherit">
                <FontAwesomeIcon icon={faUser} />
                <Link
                  to="/login"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  &nbsp; Login
                </Link>
              </Button>
            )}
            {userInfo && userInfo.admin && (
              <>
                <Button
                  id="fade-button"
                  aria-controls={open2 ? "fade-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open2 ? "true" : undefined}
                  onClick={handleClick2}
                >
                  Admin
                </Button>
                <Menu
                  id="fade-menu"
                  MenuListProps={{
                    "aria-labelledby": "fade-button",
                  }}
                  anchorEl={anchorEl2}
                  open={open2}
                  onClose={handleClose2}
                  TransitionComponent={Fade}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose2();
                      navigate("/admin/userlist");
                    }}
                  >
                    Users
                  </MenuItem>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem
                    onClick={() => {
                      handleClose2();
                      navigate("/admin/productlist");
                    }}
                  >
                    Products
                  </MenuItem>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem
                    onClick={() => {
                      handleClose2();
                      navigate("/admin/orderlist");
                    }}
                  >
                    Orders
                  </MenuItem>
                </Menu>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </header>
  );
};

export default Header;
