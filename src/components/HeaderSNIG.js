import React from 'react';

import svgfile from '../assets/images/logo.svg';

export default function HeaderSNIG() {

  return (
    <div className="p-fluid p-grid p-pt-4 p-pb-2 catolog-snig-header">
      <div className="p-col-12 p-text-center catolog-snig-header-content">
        <a href="https://snig.dgterritorio.gov.pt" target="_blank" rel="noopener noreferrer" 
          title="Abrir Portal do SNIG">
            <img className="snig-logo" src={svgfile} alt="SNIG" />
        </a>
      </div>        
    </div>
  );
}