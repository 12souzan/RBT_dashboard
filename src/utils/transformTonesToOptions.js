export const transformTonesToOptions = (tones) => {
  return tones?.map(tone => ({
    value: tone.id,
    label: tone.name,
    originalData: tone 
  })) || [];
};