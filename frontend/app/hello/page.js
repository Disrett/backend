'use client'; // client rendering

import Sidebar from '../components/sidebar';
import MobileMenu from '../components/mobilemenu';
import Header from '../components/header';
import { useState } from 'react';

export default function Page() {
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);


 return (
 <div className="flex h-screen bg-[#f8f9fa] overflow-hidden">
       <Sidebar showMenu={showMenu} setShowMenu={setShowMenu} />
       <MobileMenu 
         showMobileMenu={showMobileMenu} 
         setShowMobileMenu={setShowMobileMenu}
         showMenu={showMenu}
         setShowMenu={setShowMenu}
       />
 
       <div className="lg:ml-64 flex-1 flex flex-col w-full" onClick={() => setShowMenu(false)}>
         <Header setShowMobileMenu={setShowMobileMenu} />
 
         <main className="flex-1 overflow-y-auto pb-8 px-4 lg:px-0">
           <div className="max-w-2xl mx-auto pt-4 lg:pt-6">
                JE SUIS trop beau
             

           </div>
         </main>
       </div>

     </div>
    );
}