import React from 'react';
import { Pagination, PaginationItem } from "@mui/material";
import { gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector } from "@mui/x-data-grid";
import { paginationStyle } from "../utils/Style";

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      variant="contained"
      shape="rounded"
      page={page + 1}
      count={pageCount}
      sx={paginationStyle}
      renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

export default CustomPagination;
