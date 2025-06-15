export const validateForm = (formData, fields) => {
  const newErrors = {};
  let isValid = true;

  fields.forEach(field => {
    if (field.required && !formData[field.name]) {
      newErrors[field.name] = `${field.label} is required`;
      isValid = false;
    } else if (field.type === 'number' && field.min !== undefined) {
      if (formData[field.name] < field.min) {
        newErrors[field.name] = `${field.label} must be at least ${field.min}`;
        isValid = false;
      }
    }
  });

  return { errors: newErrors, isValid };
};


export const validateToneForm = (formData, toneFields) => {
  const errors = {};
  const bundleErrors = [];
  let isValid = true;
  toneFields.forEach(field => {
    if (field.required && !formData[field.name]) {
      errors[field.name] = `${field.label} is required`;
      isValid = false;
    }
  });

  formData.bundleList.forEach((bundle, index) => {
    const bundleError = {};
    if (!bundle.bundleId) {
      bundleError.bundleId = 'Bundle selection is required';
      isValid = false;
    }
    if (!bundle.price || bundle.price <= 0) {
      bundleError.price = 'Price must be greater than 0';
      isValid = false;
    }
    if (Object.keys(bundleError).length > 0) {
      bundleErrors[index] = bundleError;
    }
  });

  return { errors, bundleErrors, isValid };
};