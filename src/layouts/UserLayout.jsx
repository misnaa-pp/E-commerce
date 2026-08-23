import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
function UserLayout() {
  return (
    <>
     <Navbar/>

     <main>
        <Outlet/>
     </main>

    <footer className="border-t border-[#e5ded4] bg-[#f8f3ec]">
      <div className="flex flex-col items-center justify-center px-6 py-12 text-center">

        <h2 className="font-serif text-3xl tracking-[0.3em] text-[#4a2f1f]">
          INARAH
        </h2>

        <p className="mt-3 text-xs tracking-wide text-[#8a6f5c]">
          © 2026 INARAH KIDSWEAR. ALL RIGHTS RESERVED.
        </p>

      </div>
    </footer>
      
    </>
  );
}

export default UserLayout;
