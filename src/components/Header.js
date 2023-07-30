import React, { useState, useEffect } from 'react';

export default function Header({config}) {

  const header = config?.content_header;

  const [headerContent, setHeaderContent] = useState(null);

  useEffect(() => {
    if (!header.url) return;

    if (header.url) {
      const url = header.url;
      fetch(url).then(res => {
          return res.text();
      }).then(result => {
          setHeaderContent(result);
      }).catch(error => {        
          console.log('error', error);
      });
    }
  }, []);

  if (!header) return null;

  if (headerContent) {
    return (
      <div className="p-fluid p-grid p-pt-4 p-pb-2 catolog-snig-header">
        <div className="p-col-12 catolog-snig-header-content" 
          dangerouslySetInnerHTML={{ __html: headerContent }} />
      </div>
    )
  }

  if (header.html) {
    return (
      <div className="p-fluid p-grid p-pt-4 p-pb-2 catolog-snig-header">
        <div className="p-col-12 p-text-center catolog-snig-header-content" 
          dangerouslySetInnerHTML={{__html: header.html}} />
      </div>
    )
  }

  if (header.img) {
    return (
      <div className="p-fluid p-grid p-pt-4 p-pb-2 catolog-snig-header">
        <div className="p-col-12 p-text-center catolog-snig-header-content">
          { header?.link_url ?
          <a href={header.link_url || '#'} target="_blank" rel="noopener noreferrer" 
            title={header.img_title || ''}>
              <img className="catalog-logo" src={header.img} alt={header.img_title || ''} />
          </a> :
          <img className="catalog-logo" src={header.img} alt={header.img_title || ''} />
          }
        </div>
      </div>
    )
  }

  return null;

}