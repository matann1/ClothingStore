import React from "react";
import { Container } from "@mui/material";

const Footer = () => {
  return (
    <footer>
      <Container
        sx={{
          pt: 10,
          textAlign: "center",
        }}
      >
        Copyright &copy; Clothing Store
      </Container>
    </footer>
  );
};

export default Footer;
