'use client'

import { createContext, useContext, useState, ReactNode } from 'react';

interface MenuContextType {
  isMenuOpen: boolean;
  showMenu: boolean;
  isMobile: boolean;
  toggleMenu: () => void;
  setIsMobile: (value: boolean) => void;
  setShowMenu: (value: boolean) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <MenuContext.Provider
      value={{
        isMenuOpen,
        showMenu,
        isMobile,
        toggleMenu,
        setIsMobile,
        setShowMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
