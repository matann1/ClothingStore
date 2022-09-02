import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { SearchSharp } from "@mui/icons-material";
import { Button, FormControl } from "@mui/material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),

    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const SearchByLocation = () => {
  const [location, setLocation] = useState("");
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=22e315d99539c05953549f652c7fc4f6`;

  const navigate = useNavigate();

  const searchProductHandler = async (e) => {
    e.preventDefault();
    console.log(location);
    try {
      const { data } = await axios.get(url);
      setLocation("");
      navigate(`/searchLocation/${location}`, {
        state: data.main.temp.toFixed(),
      });
    } catch (error) {
      console.error(error);
      alert("City Not exist, try again.");
      navigate("/");
    }
  };

  return (
    <FormControl>
      <Search>
        <SearchIconWrapper>
          <SearchSharp />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Enter City"
          inputProps={{ "aria-label": "search" }}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: "black" }}
          onClick={searchProductHandler}
        >
          Find
        </Button>
      </Search>
    </FormControl>
  );
};

export default SearchByLocation;
