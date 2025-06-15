import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Album as AlbumIcon,
  MusicNote as TonesIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const menuItems = [
    { icon: <DashboardIcon />, label: 'Dashboard', router: '/' },
    { icon: <LibraryMusicIcon />, label: 'Bundles', router: '/bundles' },
    { icon: <TonesIcon />, label: 'Tones', router: '/tones' },
    { icon: <AlbumIcon />, label: 'Albums', router: '/albums' },
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderMenuItems = () =>
    menuItems.map((item, index) => {
      const isActive = location.pathname === item.router;
      return (
        <Link
          to={item.router}
          key={index}
          className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer
          ${isActive ? 'bg-white text-[#26448b] shadow-md' : 'text-white hover:bg-white hover:text-[#26448b]'}`}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="text-base font-medium">{item.label}</span>
        </Link>
      );
    });

  return (
    <>
      {/* Mobile Top Menu Toggle */}
      {isMobile && (
        <div className="fixed top-0 left-0 w-full bg-[#172955] text-white p-4 flex items-center justify-between z-50">
          <span className="text-lg font-bold text-center">Admin</span>
          <button
            className="bg-[#172955] px-3 py-1 rounded"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MenuIcon />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-[#172955]  text-white shadow-lg transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'w-64' : 'w-0'} ${isMobile ? 'z-50' : 'lg:w-64'} overflow-hidden`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700 text-center">
          <h1 className="text-xl font-bold tracking-wide text-center w-full">Admin</h1>
          {isMobile && (
            <button className="text-white" onClick={() => setIsSidebarOpen(false)}>
              <CloseIcon />
            </button>
          )}
        </div>

        <nav className="px-4 py-4 flex flex-col space-y-2">{renderMenuItems()}</nav>

        {/* Logout */}
        <div className="absolute bottom-4 w-full px-4">
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="flex items-center gap-3 w-full p-3 rounded-lg text-white bg-[#df307e] "
          >
            <LogoutIcon />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
