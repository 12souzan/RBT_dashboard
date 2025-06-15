import { useState } from 'react';
import BundlePricesSection from './BundlePriceSection';

const BundlePriceManager = ({
  bundles,
  showSnackbar,
  // Existing tones case props
  selectionModel,
  createBundlePrice,
  deleteBundlePrice,
  fetchToneDetails,
  onClose,
  // New tone case props
  formData,
  setFormData,
  isNewTone = false,
  isAlbumContext = false
}) => {
  const [priceForm, setPriceForm] = useState({
    bundleId: '',
    price: 0,
    validity: 30,
    gracePeriod: 7
  });
  const [editingPrice, setEditingPrice] = useState(null);
  const [selectedBundles, setSelectedBundles] = useState([]);

  const currentBundles = isNewTone ? formData?.bundleList || [] : selectedBundles;

  const handleAddPrice = () => {
    if (!priceForm.bundleId || priceForm.price <= 0) {
      showSnackbar("Please select a bundle and enter a valid price", "error");
      return;
    }

    const bundle = bundles.find(b => b.id === priceForm.bundleId);
    if (!bundle) return;

    const newBundle = {
      bundleId: priceForm.bundleId,
      price: priceForm.price,
      name: bundle.name,
      validity: bundle.validity,
      gracePeriod: bundle.gracePeriod
    };

    if (editingPrice) {
      if (isNewTone) {
        setFormData(prev => ({
          ...prev,
          bundleList: prev.bundleList.map(b =>
            b.bundleId === editingPrice.bundleId ? newBundle : b
          )
        }));
      } else {
        setSelectedBundles(prev =>
          prev.map(b =>
            b.bundleId === editingPrice.bundleId ? newBundle : b
          )
        );
      }
      setEditingPrice(null);
    } else {
      const exists = isNewTone
        ? formData.bundleList.some(b => b.bundleId === priceForm.bundleId)
        : currentBundles.some(b => b.bundleId === priceForm.bundleId);

      if (exists) {
        showSnackbar("This bundle is already in your current selection", "error");
        return;
      }

      if (isNewTone) {
        setFormData(prev => ({
          ...prev,
          bundleList: [...prev.bundleList, newBundle]
        }));
      } else {
        setSelectedBundles(prev => [...prev, newBundle]);
      }
    }

    setPriceForm({
      bundleId: '',
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

  const handleDeletePrice = (bundleId) => {
    if (isNewTone) {
      setFormData(prev => ({
        ...prev,
        bundleList: prev.bundleList.filter(b => b.bundleId !== bundleId)
      }));
    } else {
      setSelectedBundles(prev => prev.filter(b => b.bundleId !== bundleId));
    }
  };

  const handleSubmit = async () => {
    if (currentBundles.length === 0) {
      showSnackbar("Please add at least one bundle", "error");
      return;
    }

    if (!isNewTone && (!selectionModel || selectionModel.length === 0)) {
      showSnackbar("No items selected", "error");
      return;
    }

    try {
      const results = [];
      const skipped = [];

      for (const bundle of currentBundles) {
        let addedToAny = false;

        for (const itemId of selectionModel) {
          try {
            const itemDetails = await fetchToneDetails(itemId);
            const exists = itemDetails?.bundleList?.some(b => b.bundleId === bundle.bundleId);
            if (exists) {
              skipped.push(`Item ${itemId} already has bundle ${bundle.name}`);
              continue;
            }

            const priceData = {
              bundleId: bundle.bundleId,
              price: bundle.price,
              ...(isAlbumContext ? { albumId: itemId } : { toneId: itemId })
            };

            await createBundlePrice(priceData);
            results.push(`Added ${bundle.name} to ${isAlbumContext ? 'album' : 'tone'} ${itemId}`);
            addedToAny = true;
          } catch (err) {
            skipped.push(`Failed to add ${bundle.name} to ${isAlbumContext ? 'album' : 'tone'} ${itemId}: ${err.message}`);
          }
        }

        if (!addedToAny) {
          skipped.push(`Bundle ${bundle.name} was not added to any ${isAlbumContext ? 'albums' : 'tones'} (already exists)`);
        }
      }

      if (results.length > 0) {
        showSnackbar(`Successfully added bundles to ${results.length} ${isAlbumContext ? 'album(s)' : 'tone(s)'}`, "success");
      }
      if (skipped.length > 0) {
        console.log("Skipped assignments:", skipped);
        showSnackbar(`${skipped.length} assignments were skipped (already exist or failed)`, "info");
      }

      setSelectedBundles([]);
      onClose?.();
    } catch (err) {
      showSnackbar(`Error processing bundles: ${err.message}`, 'error');
    }
  };

  return (
    <BundlePricesSection
      bundles={bundles}
      priceForm={priceForm}
      setPriceForm={setPriceForm}
      formData={{ bundleList: currentBundles }}
      handleAddPrice={handleAddPrice}
      handleEditPrice={handleEditPrice}
      handleUpdatePrice={handleAddPrice}
      handleDeletePrice={handleDeletePrice}
      editingPrice={editingPrice}
      onSave={!isNewTone ? handleSubmit : undefined}
      onCancel={!isNewTone ? onClose : undefined}
      isNewTone={isNewTone}
    />
  );
};

export default BundlePriceManager;