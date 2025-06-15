import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TonesTable from "./pages/Tones/Index";
import Albums from "./pages/Albums/Albums";
import ToneForm from "./pages/Tones/ToneForm";
import View from "./pages/Tones/View";
import ViewBundle from "./pages/Bundles/View";
import Edit from "./pages/Tones/Edit";
import IndexBundle from "./pages/Bundles/Index";
import AlbumForm from "./pages/Albums/AlbumForm";
import ViewAlbum from "./pages/Albums/View";
import EditAlbum from "./pages/Albums/Edit";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        {/* tones routes */}
        <Route path="/tones" element={<TonesTable/>} />
        <Route path="/add_tone" element={<ToneForm/>} />
        <Route path="/tone/view/:id" element={<View/>} />
        <Route path="/tone/edit/:id" element={<Edit/>} />

        <Route path= '/bundles' element={<IndexBundle/>}/>
        <Route path= '/bundle/view/:id' element={<ViewBundle/>}/>
        
        <Route path="/albums" element={<Albums />} />
        <Route path="/add_album" element={<AlbumForm/>} />
        <Route path="/album/view/:id" element={<ViewAlbum/>} />
        <Route path="/album/edit/:id" element={<EditAlbum/>} />

      </Routes>
    </Router>
  )
}

export default App
