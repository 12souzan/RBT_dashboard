import React, { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import FormInput from "../../components/FormInput";
import { toneFields } from "../../env";
import MainLayout from '../../layouts/MainLayout';
import { useParams } from "react-router-dom";
import { useTone } from "../../context/ToneContext";
import { useBundle } from "../../context/BundleContext";
import BundlePricesSection from "../../components/Bundle/BundlePriceSection";
import BreadcrumbsTitle from "../../components/Breadcrumbs";
import BundlePriceManager from "../../components/Bundle/BundlePriceManager";
import Loading from "../../components/Loading";

const EditToneForm = () => {
  const { id } = useParams();
  const {
    currentTone,
    isLoading,
    fetchToneDetails,
    updateTone,
    showSnackbar
  } = useTone();
  const breadcrumbItems = [
    { label: 'Tones', path: '/tones' },
    { label: 'Edit Tone' },
  ];

  const { bundles , showSnackbar:BundleSnackBar} = useBundle()

  const [formData, setFormData] = useState({
    name: "",
    artist: "",
    genre: "",
    language: "",
    toneType: "GALLERY_TONE",
    active: false,
    toneFile: null,
    toneFileName: "",
    imageFile: null,
    imageFileName: "",
    albumId: "",
    standaloneTone: false,
    bundleList: [],
  });

  const [errors, setErrors] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false);
  const [priceForm, setPriceForm] = useState({
    bundleId: "",
    price: 0,
    validity: 30,
    gracePeriod: 7
  });
  const [editingPrice, setEditingPrice] = useState(null);

  useEffect(() => {
    if (!id) {
      showSnackbar('No tone ID provided', 'error');
      return;
    }

    const loadToneData = async () => {
      try {
        await fetchToneDetails(id);
        setHasLoaded(true);
      } catch (err) {
        console.error("Failed to load tone data:", err);
        showSnackbar(`Failed to load tone: ${err.message}`, 'error');
      }
    };

    loadToneData();
  }, [id]);

  console.log('has loaded', hasLoaded)
  console.log('has currentTone', currentTone)
  useEffect(() => {
    if (hasLoaded && currentTone) {
      setFormData({
        name: currentTone.name || "",
        artist: currentTone.artist || "",
        genre: currentTone.genre || "",
        language: currentTone.language || "",
        toneType: currentTone.toneType || "GALLERY_TONE",
        active: Boolean(currentTone.active),
        toneFile: currentTone.toneUrl,
        toneFileName: currentTone.toneUrl ? "Current tone file" : "",
        imageFile: currentTone.image,
        imageFileName: currentTone.image ? "Current image file" : "",
        albumId: currentTone.albumId || "",
        standaloneTone: currentTone.standaloneTone || false,
        bundleList: currentTone.bundleList ? currentTone.bundleList.map(b => ({
          bundleId: b.id || b.bundleId,
          name: b.name,
          price: b.price,
          validity: b.validity,
          gracePeriod: b.gracePeriod
        })) : []
      });
    }
  }, [hasLoaded, currentTone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTone(id, formData);
      showSnackbar('Tone updated successfully!');
    } catch (err) {
      console.error("Error updating tone:", err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
      showSnackbar(`Error updating tone: ${err.message}`, 'error');
    }
  };

  const handleFileChange = (field) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file,
        [`${field}Name`]: file.name
      }));
    }
  };

  const handleAddPrice = () => {
    if (!priceForm.bundleId || priceForm.price <= 0) return;

    setFormData(prev => ({
      ...prev,
      bundleList: [
        ...prev.bundleList,
        {
          bundleId: priceForm.bundleId,
          price: priceForm.price,
          validity: priceForm.validity,
          gracePeriod: priceForm.gracePeriod,
          name: `Bundle ${priceForm.bundleId}`
        }
      ]
    }));

    setPriceForm({
      bundleId: "",
      price: 0,
      validity: 30,
      gracePeriod: 7
    });
  };

  const handleEditPrice = (bundle) => {
    setEditingPrice(bundle);
    setPriceForm({
      bundleId: bundle.bundleId,
      price: bundle.price,
      validity: bundle.validity,
      gracePeriod: bundle.gracePeriod
    });
  };

  const handleUpdatePrice = () => {
    if (!priceForm.bundleId || priceForm.price <= 0) return;

    setFormData(prev => ({
      ...prev,
      bundleList: prev.bundleList.map(b =>
        b.bundleId === editingPrice.bundleId
          ? {
            ...b,
            price: priceForm.price,
            validity: priceForm.validity,
            gracePeriod: priceForm.gracePeriod
          }
          : b
      )
    }));

    setEditingPrice(null);
    setPriceForm({
      bundleId: "",
      price: 0,
      validity: 30,
      gracePeriod: 7
    });
  };

  const handleDeletePrice = (bundleId) => {
    setFormData(prev => ({
      ...prev,
      bundleList: prev.bundleList.filter(b => b.bundleId !== bundleId)
    }));
  };

  if (isLoading && !hasLoaded) {
    return (
      <MainLayout>
        <Loading/>
      </MainLayout>
    );
  }

  if (!currentTone && hasLoaded) {
    return (
      <MainLayout>
        <Typography>Tone not found</Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <BreadcrumbsTitle items={breadcrumbItems} />

      <form onSubmit={handleSubmit} className="bg-white p-5 shadow-custom">
        <Typography sx={{ fontWeight: '700', textAlign: 'center', fontSize: '35px' }}>
          Edit Tone
        </Typography>

        <FormInput
          fields={toneFields}
          data={formData}
          setData={setFormData}
          errors={errors}
          onFileChange={handleFileChange}
        />

        {/* <BundlePricesSection
          bundles={bundles}
          priceForm={priceForm}
          setPriceForm={setPriceForm}
          formData={formData}
          handleAddPrice={handleAddPrice}
          handleEditPrice={handleEditPrice}
          handleUpdatePrice={handleUpdatePrice}
          handleDeletePrice={handleDeletePrice}
          editingPrice={editingPrice}
        /> */}

        <BundlePriceManager
          bundles={bundles}
          formData={formData}
          setFormData={setFormData}
          showSnackbar={BundleSnackBar}
          isNewTone={false}
          handleAddPrice={handleAddPrice}
          handleEditPrice={handleEditPrice}
          handleUpdatePrice={handleUpdatePrice}
          handleDeletePrice={handleDeletePrice}
          editingPrice={editingPrice}
        />

        <div className="w-full flex mt-2">
          <Button
            type="submit"
            variant="contained"
            className="w-full"
            disabled={isLoading}
          >
            Update Tone
          </Button>
        </div>
      </form>
    </MainLayout>
  );
};

export default EditToneForm;