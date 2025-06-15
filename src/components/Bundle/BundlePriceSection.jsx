import React from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  TextField,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from "@mui/material";
import { Add, Edit, Delete, Save } from "@mui/icons-material";

const BundlePricesSection = ({
  bundles,
  priceForm,
  setPriceForm,
  formData,
  handleAddPrice,
  handleEditPrice,
  handleUpdatePrice,
  handleDeletePrice,
  editingPrice,
  onSave,
  onCancel,
  isNewTone = false
}) => {
  return (
    <Box my={4}>
      <Typography variant="h6" gutterBottom>
        Bundle Prices
      </Typography>
      <Divider />

      <Box mt={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={5} sx={{ width: '45%' }}>
            <FormControl fullWidth>
              <InputLabel>Select Bundle</InputLabel>
              <Select
                value={priceForm.bundleId}
                onChange={(e) => {
                  const selectedBundle = bundles.find(b => b.id === e.target.value);
                  setPriceForm({
                    ...priceForm,
                    bundleId: e.target.value,
                    validity: selectedBundle?.validity || 30,
                    gracePeriod: selectedBundle?.gracePeriod || 7
                  });
                }}
                label="Select Bundle"
              >
                {bundles.map((bundle) => (
                  <MenuItem
                    key={bundle.id}
                    value={bundle.id}
                    disabled={formData.bundleList.some(b => b.bundleId === bundle.id && (!editingPrice || editingPrice.bundleId !== bundle.id))}
                  >
                    {bundle.name} (Validity: {bundle.validity} days)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3} sx={{ width: '45%' }}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={priceForm.price}
              onChange={(e) => setPriceForm({
                ...priceForm,
                price: parseFloat(e.target.value) || 0
              })}
            />
          </Grid>
          <Grid item xs={2}>
            {editingPrice ? (
              <IconButton color="primary" onClick={handleUpdatePrice}>
                <Save />
              </IconButton>
            ) : (
              <IconButton color="primary" onClick={handleAddPrice}>
                <Add />
              </IconButton>
            )}
          </Grid>
        </Grid>
      </Box>

      {formData.bundleList && formData.bundleList.length > 0 && (
        <Box mt={2}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Bundle Name</TableCell>
                  <TableCell>Validity (days)</TableCell>
                  <TableCell>Grace Period (days)</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.bundleList.map((bundle, index) => (
                  <TableRow key={`${bundle.bundleId}-${index}`}>
                    <TableCell>{bundle.name}</TableCell>
                    <TableCell>{bundle.validity || 30}</TableCell>
                    <TableCell>{bundle.gracePeriod || 7}</TableCell>
                    <TableCell>{bundle.price}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditPrice(bundle)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeletePrice(bundle.bundleId)}
                      >
                        <Delete fontSize="small" color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {!isNewTone && (
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={onSave}
            disabled={formData.bundleList.length === 0}
          >
            Save All Bundles
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default BundlePricesSection;