import React, { useState } from "react";
import {
  Button,
  Typography,
} from "@mui/material";
import FormInput from "../../components/FormInput";
import { INITIAL_DATA, toneFields } from "../../env";
import MainLayout from '../../layouts/MainLayout';
import { useTone } from "../../context/ToneContext";
import { useNavigate } from "react-router-dom";
import { useBundle } from "../../context/BundleContext";
import BundlePriceManager from "../../components/Bundle/BundlePriceManager";
import BreadcrumbsTitle from "../../components/Breadcrumbs";

const ToneForm = () => {
  const { showSnackbar, createTone } = useTone();
  const { bundles, createBundlePrice, updateBundlePrice, showSnackbar: BundleSnackBar } = useBundle();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const breadcrumbItems = [
    { label: 'Tones', path: '/tones' },
    { label: 'Create New Tone' },
  ];

  const [formData, setFormData] = useState({
    ...INITIAL_DATA,
    currentImage: "",
    imagePreview: "",
    bundleList: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name || !formData.artist || !formData.genre || !formData.language) {
        throw new Error('Please fill all required fields');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('artist', formData.artist);
      formDataToSend.append('genre', formData.genre);
      formDataToSend.append('language', formData.language);
      formDataToSend.append('toneType', formData.toneType || 'GALLERY_TONE');
      formDataToSend.append('active', formData.active ? true : false);
      console.log('Submitting with active state:', formData.active);

      if (formData.toneFile) formDataToSend.append('toneFile', formData.toneFile);
      if (formData.imageFile) formDataToSend.append('imageFile', formData.imageFile);
      if (formData.albumId) formDataToSend.append('albumId', formData.albumId);

      // First create the tone
      const toneResponse = await createTone(formDataToSend);
      if (!toneResponse?.id) {
        throw new Error('Tone creation succeeded but no ID was returned');
      }

      // Then create bundle prices if any
      if (formData.bundleList.length > 0) {
        await Promise.all(
          formData.bundleList.map(async bundle => {
            const priceData = {
              toneId: toneResponse.id,
              bundleId: bundle.bundleId,
              price: bundle.price,
              albumId: formData.albumId || ''
            };

            return await createBundlePrice(priceData);
          })
        );
      }

      showSnackbar("Tone created successfully!");
      setFormData(INITIAL_DATA);
      navigate('/tones');
    } catch (err) {
      console.error("Submission error:", err);
      showSnackbar(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <BreadcrumbsTitle items={breadcrumbItems} />
      <form onSubmit={handleSubmit} className="bg-white mt-3 p-5 shadow-custom">
        <Typography sx={{ fontWeight: '700', textAlign: 'center', fontSize: '35px' }}>
          Create Tone
        </Typography>

        <FormInput
          fields={toneFields}
          data={formData}
          setData={setFormData}
        />

        <BundlePriceManager
          bundles={bundles}
          formData={formData}
          setFormData={setFormData}
          showSnackbar={BundleSnackBar}
          isNewTone={true}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          sx={{ mt: 3 }}
        >
          {isSubmitting ? 'Creating...' : 'Create Tone'}
        </Button>

      </form>
    </MainLayout>
  );
};

export default ToneForm;