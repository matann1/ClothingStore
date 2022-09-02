import React from "react";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { Link } from "react-router-dom";

const PaginationProducts = ({ page, pages, keyword = "" }) => {
  return (
    <Pagination
      page={page}
      count={pages}
      renderItem={(item) => (
        <PaginationItem
          component={Link}
          to={`/search/${keyword}page/${page}`}
          {...item}
        />
      )}
    />
  );
};

export default PaginationProducts;
