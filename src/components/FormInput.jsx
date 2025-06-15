import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Typography,
  Stack,
  IconButton,
  Button,
  Paper,
  Box,
  Divider,
  Grid,
  Chip,
  Avatar
} from "@mui/material";
import { Add, Delete, MusicNote, Image, InsertPhoto, Audiotrack } from "@mui/icons-material";

const FormInput = ({ fields = [], data = {}, setData, errors = {}, Media = true, AudioUpload = true, removeToneFromAlbum, albumId }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleChange = (e) => {
    const { name, type, checked, value, files } = e.target;
    const field = fields.find(f => f.name === name);

    if (field?.type === 'dropdown') {
      if (field.multiple) {
        setData(prev => ({ ...prev, [name]: value }));
      } else {
        setData(prev => ({ ...prev, [name]: value }));
        setOpenDropdown(null);
      }
    }
    else {
      const newValue = type === "checkbox" ? checked :
        type === "file" ? files[0] :
          value;
      setData(prev => ({ ...prev, [name]: newValue }));
    }
  };

  const handleArrayChange = (fieldName, index, key, value) => {
    const arr = [...(data[fieldName] || [])];
    arr[index] = { ...arr[index], [key]: value };
    setData((prev) => ({ ...prev, [fieldName]: arr }));
  };

  const addToArrayField = (fieldName, defaultItem) => {
    const updated = [...(data[fieldName] || []), defaultItem];
    setData((prev) => ({ ...prev, [fieldName]: updated }));
  };

  const removeFromArrayField = (fieldName, index) => {
    const updated = [...(data[fieldName] || [])];
    updated.splice(index, 1);
    setData((prev) => ({ ...prev, [fieldName]: updated }));
  };

  const handleRemoveTone = async (toneId) => {
    if (albumId) {
      try {
        await removeToneFromAlbum(albumId, toneId);
        setData(prev => ({
          ...prev,
          albumTones: prev.albumTones.filter(id => id !== toneId)
        }));
      } catch (error) {
        console.error("Error removing tone:", error);
      }
    } else {
      setData(prev => ({
        ...prev,
        albumTones: prev.albumTones.filter(id => id !== toneId)
      }));
    }
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleClose = () => {
    setOpenDropdown(null);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      padding: 2,
    }}>
      {fields.filter(f => f.type !== 'toneFile' && f.type !== 'imageFile').map((field) => (
        <Grid key={field.name}>
          {renderField(field)}
        </Grid>
      ))}
      {Media && (
        <Paper elevation={2} sx={{ p: 3, mt: 2, background: '#b5baca6e' }}>
          <Typography gutterBottom sx={{ fontWeight: '600', textAlign: 'center', fontSize: '25px' }}>
            Media Uploads
          </Typography>
          <Box sx={{
            display: 'grid',
            ...(AudioUpload
              ? { gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' } }
              : { gridTemplateColumns: '1fr' }
            ),
            gap: 4,
            padding: 2,
          }}>
            {fields.filter(f => f.type === 'imageFile').map((field) => (
              <Box key={field.name}>
                {renderField(field)}
                {data[field.name] && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Current Image:
                    </Typography>
                    {typeof data[field.name] === 'string' ? (
                      <Box sx={{
                        border: '1px dashed grey',
                        p: 1,
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'center'
                      }}>
                        <img
                          src={data[field.name]}
                          alt="Current tone preview"
                          style={{
                            maxHeight: 200,
                            maxWidth: '100%',
                            objectFit: 'contain'
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWltYWdlIj48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIvPjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSIyIi8+PHBhdGggZD0ibTIxIDE1LTMuMDg2LTMuMDg2YTIgMiAwIDAgMC0yLjgyOCAwTDMgMjEiLz48L3N2Zz4=';
                          }}
                        />
                      </Box>
                    ) : (
                      <Chip
                        avatar={<Avatar><InsertPhoto /></Avatar>}
                        label={data[field.name].name}
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                )}
              </Box>
            ))}
            {AudioUpload && (
              <Grid item xs={12} sm={6}>
                {fields.filter(f => f.type === 'toneFile').map((field) => (
                  <Box key={field.name}>
                    {renderField(field)}
                    {data[field.name] && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Current Audio:
                        </Typography>
                        {typeof data[field.name] === 'string' ? (
                          <Box>
                            <audio controls style={{ width: '100%' }}>
                              <source src={data[field.name]} type="audio/mpeg" />
                              Your browser does not support the audio element.
                            </audio>
                            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                              {data[`${field.name}Name`] || "Current audio file"}
                            </Typography>
                          </Box>
                        ) : (
                          <Chip
                            avatar={<Avatar><Audiotrack /></Avatar>}
                            label={data[field.name].name}
                            variant="outlined"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </Box>
                    )}
                  </Box>
                ))}
              </Grid>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );

  function renderField(field) {
    const { name, label, type, options = [], disabled = false } = field;

    switch (type) {
      case "text":
      case "number":
        return (
          <TextField
            fullWidth
            type={type}
            label={label}
            name={name}
            value={data[name] || ""}
            onChange={handleChange}
            error={!!errors[name]}
            helperText={errors[name]}
            disabled={disabled}
            variant="outlined"
            size="small"
          />
        );

      case "dropdown":
        return (
          <FormControl fullWidth size="small" error={!!errors[name]}>
            <InputLabel>{label}</InputLabel>
            <Select
              name={name}
              value={field.multiple ? (data[name] || []) : (data[name] || "")}
              label={label}
              onChange={handleChange}
              onClose={handleClose}
              onOpen={() => toggleDropdown(name)}
              open={openDropdown === name}
              variant="outlined"
              multiple={field.multiple}
              renderValue={
                field.multiple
                  ? (selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const selectedOption = Array.isArray(options) && options[0]?.value
                          ? options.find(opt => opt.value === value)
                          : { label: value };
                        return (
                          <Chip
                            key={value}
                            label={selectedOption?.label || value}
                            onDelete={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveTone(value);
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();

                            }}
                          />
                        );
                      })}
                    </Box>
                  )
                  : undefined
              }
            >
              {Array.isArray(options) && options[0]?.value
                ? options.map((opt) => (
                  <MenuItem
                    key={opt.value}
                    value={opt.value}
                    disabled={field.multiple && data[name]?.includes(opt.value)}
                    onClick={(e) => {
                      if (!field.multiple) {
                        setOpenDropdown(null);
                      } else {
                        setOpenDropdown(null);
                      }
                    }}
                  >
                    {opt.label}
                  </MenuItem>
                ))
                : options.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    disabled={field.multiple && data[name]?.includes(option)}
                    onClick={(e) => {
                      if (!field.multiple) {
                        setOpenDropdown(null);
                      } else {
                        setOpenDropdown(null);
                      }
                    }}
                  >
                    {option}
                  </MenuItem>
                ))}
            </Select>
            {errors[name] && (
              <Typography variant="caption" color="error">
                {errors[name]}
              </Typography>
            )}
          </FormControl>
        );
      case "switch":
        return (
          <FormControlLabel
            control={
              <Switch
                name={name}
                checked={data[name] === true || data[name] === "true"}
                onChange={(e) => {
                  setData(prev => ({
                    ...prev,
                    [name]: e.target.checked
                  }));
                }}
                color="primary"
              />
            }
            label={label}
            sx={{ m: 0 }}
          />
        );

      case "toneFile":
        return (
          <Button
            variant="contained"
            component="label"
            fullWidth
            startIcon={<MusicNote />}
            sx={{
              background: '#172955',
              color: 'white',
              '&:hover': { background: '#172955c2' }
            }}
          >
            {label}
            <input
              hidden
              type="file"
              name={name}
              accept="audio/*"
              onChange={handleChange}
              error={!!errors[name]}
              helperText={errors[name]}
            />
          </Button>
        );

      case "imageFile":
        return (
          <Button
            variant="contained"
            component="label"
            fullWidth
            startIcon={<Image />}
            sx={{
              background: '#df307e',
              color: 'white',
              '&:hover': { background: '#df307ec2' }
            }}
          >
            {label}
            <input
              hidden
              type="file"
              name={name}
              accept="image/*"
              onChange={handleChange}
              error={!!errors[name]}
              helperText={errors[name]}
            />
          </Button>
        );

      case "array":
        return (
          <Paper sx={{ p: 2, background: '#00000017', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Typography gutterBottom sx={{ fontWeight: '600', textAlign: 'center', fontSize: '25px' }}>
              {label}
            </Typography>
            <Stack spacing={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {(data[name] || []).map((item, idx) => (
                <Paper key={idx} elevation={0} sx={{ p: 2, border: '1px solid #eee' }}>
                  <Grid container spacing={2}>
                    {field.itemFields.map((f) => (
                      <Grid item xs={12} sm={6} md={3} key={f.name}>
                        {f.type === "switch" ? (
                          <FormControlLabel
                            control={
                              <Switch
                                checked={item[f.name] || false}
                                onChange={(e) =>
                                  handleArrayChange(name, idx, f.name, e.target.checked)
                                }
                                size="small"
                              />
                            }
                            label={f.label}
                            labelPlacement="start"
                            sx={{ m: 0 }}
                          />
                        ) : (
                          <TextField
                            fullWidth
                            label={f.label}
                            value={item[f.name] || ""}
                            onChange={(e) =>
                              handleArrayChange(name, idx, f.name, e.target.value)
                            }
                            variant="outlined"
                            size="small"
                          />
                        )}
                      </Grid>
                    ))}
                    <Grid item xs={12} sx={{ textAlign: 'right' }}>
                      <IconButton
                        size="small"
                        onClick={() => removeFromArrayField(name, idx)}
                      >
                        <Delete fontSize="small" sx={{ color: 'red' }} />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{ width: '250px' }}
                onClick={() => addToArrayField(name, field.defaultItem)}
              >
                Add Bundle
              </Button>
            </Stack>
          </Paper>
        );

      default:
        return null;
    }
  }
};

export default FormInput;