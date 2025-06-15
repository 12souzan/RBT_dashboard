export const BASE_URL = 'http://192.168.50.17:8080/'


export const ALBUM_INITIAL_DATA = {
  name: "",
  featuredArtists: "",
  genre: "",
  albumTones:[],
  imageFile: null,
  bundleList: [],
};

export const INITIAL_DATA = {
  name: "",
  artist: "",
  genre: "",
  language: "",
  toneType: "GALLERY_TONE",
  active: false,
  toneFile: null,
  imageFile: null,
  albumId: "",
  bundleList: [],
}

export const INITIAL_PRICE_DATA = {
  bundleId: "",
  price: 0,
  bundleName: "",
  validity: 30,
  gracePeriod: 7
};


export const bundleField = [
  { name: "name", label: "name", type: "text" , required: true},
  { name: "alias", label: "Alias", type: "text" ,  required: true},
  { name: "validity", label: "Validity (days)", type: "number", min: 1 , required: true},
  { name: "gracePeriod", label: "Grace Period (days)", type: "number", min: 0 , required: true },
];

export const bundleColumns = [
  {
    field: "name",
    name: "Bundle Name",
    type: "string",
    flex: 2
  },
  {
    field: "alias",
    name: "Alias",
    type: "string",
    flex: 1
  },
  // {
  //   field: "price",
  //   name: "Price",
  //   type: "number",
  //   flex: 1
  // },
  {
    field: "validity",
    name: "Validity (days)",
    type: "number",
    flex: 1
  },
  {
    field: "gracePeriod",
    name: "Grace Period (days)",
    type: "number",
    flex: 1
  },
  // {
  //   field: "rbtType",
  //   name: "RBT Type",
  //   type: "text",
  //   options: ["STANDARD", "PREMIUM", "EXCLUSIVE"],
  //   flex: 1
  // },
  {
    field: "active",
    name: "Active",
    type: "boolean",
    width: 100
  },
  {
    field: "actions",
    label: "Actions",
    width: 160
  }
];

export const toneFields = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "artist", label: "Artist", type: "text", required: true },
  { name: "genre", label: "Genre", type: "text", required: true },
  {
    name: "language",
    label: "Language",
    type: "dropdown",
    required: true,
    options: ["ARABIC", "ENGLISH"],
  },
  {
    name: "toneType",
    label: "Tone Type",
    type: "dropdown",
    options: ["GALLERY_TONE"],
  },
  { name: "active", label: "Active", type: "switch" },
  { name: "toneFile", label: "Upload Tone File", type: "toneFile" , required: true, },
  { name: "imageFile", label: "Upload Image", type: "imageFile" , required: true, },
  // bundleField
];

export const musicColumns = [
  {
    field: "name",      
    headerName: "Name",    
    type: "string",         
    flex: 2,                
    editable: false        
  },
  {
    field: "artist",
    headerName: "Artist",
    type: "string",
    flex: 2,
    editable: false
  },
  {
    field: "genre",
    headerName: "Genre",
    type: "string",
    flex: 1,
    editable: false
  },
  {
    field: "language",
    headerName: "Language",
    type: "string",  
    flex: 1,
    editable: false          
  },
  {
    field: "active",
    headerName: "Active",
    type: "boolean",        
    width: 100,            
    editable: false
  },
  {
    field: "standaloneTone",
    headerName: "Standalone Tone",
    type: "boolean",
    width: 150,
    editable: true
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    sortable: false,        
    filterable: false,      
    editable: false,
    renderCell: (params) => { 
      return null; 
    }
  }
];

export const albumColumns = [
  {
    field: "name",      
    headerName: "Name",    
    type: "string",         
    flex: 2,                
    editable: false        
  },
  {
    field: "featuredArtists",
    headerName: "Artist",
    type: "string",
    flex: 2,
    editable: false
  },
  {
    field: "genre",
    headerName: "Genre",
    type: "string",
    flex: 1,
    editable: false
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    sortable: false,        
    filterable: false,      
    editable: false,
    renderCell: (params) => { 
      return null; 
    }
  }
];

export const getAlbumFields = (toneOptions = []) => [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "featuredArtists", label: "Artist", type: "text", required: true },
  { name: "genre", label: "Genre", type: "text", required: true },
  {
    name: "albumTones",
    label: "Tones",
    type: "dropdown",
    required: true,
    options: toneOptions,
    multiple: true ,
    value: [] 
  },

  { name: "imageFile", label: "Upload Image", type: "imageFile" },
  // bundleField
];


