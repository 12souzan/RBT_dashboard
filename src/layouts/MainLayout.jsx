import React from 'react';
import SideBar from '../components/SideBar';

function MainLayout({ children, className = '' }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-t  from-[#1b2b5b69] to-[#e5232500]">
      <SideBar />
      <main
        className={`flex-1 transition-all duration-300 ease-in-out pt-16 lg:py-[50px] px-4 md:px-[50px] w-full md:w-1/2 ml-0 lg:ml-64 ${className}`}
      >
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
