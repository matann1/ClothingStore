import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useNavigate } from "react-router-dom";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const navigate = useNavigate();
  const [alignment, setAlignment] = React.useState("web");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange}
    >
      {step1 ? (
        <ToggleButton onClick={() => navigate("/login")} value="step1">
          Sign In
        </ToggleButton>
      ) : (
        <ToggleButton disabled>Sign In</ToggleButton>
      )}

      {step2 ? (
        <ToggleButton onClick={() => navigate("/shipping")} value="step2">
          Shipping
        </ToggleButton>
      ) : (
        <ToggleButton disabled>Shipping</ToggleButton>
      )}

      {step3 ? (
        <ToggleButton onClick={() => navigate("/payment")} value="step3">
          Payment
        </ToggleButton>
      ) : (
        <ToggleButton disabled>Payment</ToggleButton>
      )}

      {step4 ? (
        <ToggleButton onClick={() => navigate("/placeorder")} value="step4">
          Place Order
        </ToggleButton>
      ) : (
        <ToggleButton disabled>Place Order</ToggleButton>
      )}
    </ToggleButtonGroup>
  );
};

export default CheckoutSteps;
