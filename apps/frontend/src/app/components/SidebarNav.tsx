
import React from 'react';

interface SidebarNavProps {
  children?: React.ReactNode;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ children }) => {
  return (
    <div className="sidebar-nav">
      {children}
    </div>
  );
};

export default SidebarNav;
