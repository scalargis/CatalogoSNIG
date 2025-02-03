import React from 'react';

import svgfile from '../assets/images/logo.svg';

export default function HeaderSNIG() {

  return (
    <div className="p-fluid grid pt-4 pb-2 catolog-snig-header">
      <div className="col-12 text-center catolog-snig-header-content">
        <a href="https://snig.dgterritorio.gov.pt" target="_blank" rel="noopener noreferrer" 
          title="Abrir Portal do SNIG">
            <img className="snig-logo" src={svgfile} alt="SNIG" />
        </a>
      </div>        
    </div>
  );
}