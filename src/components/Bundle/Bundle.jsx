import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Divider, Box
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import FormInput from '../FormInput';
import { bundleField } from '../../env';
import { validateForm } from '../../utils/ValidateFunction';

function BundleManagerDialog({ open, onClose, onSave, editBundle = null }) {
  const [formData, setFormData] = useState({
    name: null,
    alias: null,
    price: 0,
    validity: 0,
    gracePeriod: 0,
    rbtType: "RBT"
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editBundle) {
      setFormData({
        name: editBundle.name,
        alias: editBundle.alias,
        validity: editBundle.validity,
        gracePeriod: editBundle.gracePeriod,
      });
      setErrors({});
    } else {
      setFormData({
        name: null,
        alias: null,
        price: 0,
        validity: 0,
        gracePeriod: 0,
        rbtType: "RBT"
      });
      setErrors({});
    }
  }, [editBundle, open]);

  const handleSubmit = () => {
    const { errors: validationErrors, isValid } = validateForm(formData, bundleField);
    setErrors(validationErrors);
    
    if (isValid) {
      const bundleData = {
        ...formData,
      };
      onSave(bundleData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Typography variant="h6" component="div">
          {editBundle ? 'Edit Bundle' : 'Create New Bundle'}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <FormInput
          fields={bundleField}
          data={formData}
          setData={setFormData}
          errors={errors}
          Media={false}
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          startIcon={<Cancel />}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          startIcon={<Save />}
        >
          Save Bundle
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BundleManagerDialog;