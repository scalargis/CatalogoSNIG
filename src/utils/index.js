import { SNIG_URL } from '../constants';

export const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  return false;
};


export const formatDate = (inputDate, format) => {

  if (isNaN(inputDate)) return null;

  let date, month, year;

  let _format = !format ? '{dd}-{mm}-{yyyy}' : format;

  date = inputDate.getDate();
  month = inputDate.getMonth() + 1;
  year = inputDate.getFullYear();

  date = date
      .toString()
      .padStart(2, '0');

  month = month
      .toString()
      .padStart(2, '0');

  let val = _format.replace('dd', date);
  val = val.replace('mm', month);
  val = val.replace('yyyy', year);

    return val;
}

export const getServiceUrl = (url) => {
  return url || SNIG_URL;
}

export const getViewLinks = (md) => {
  if (!md?.link?.length) return;

  const originalLinks = Array.isArray(md?.link) ? md.link.map(l => {
    const lnk = l.split('|');
    return {
      type: lnk[3],      
      url: lnk[2],
      format: lnk[4]
    };
  }) : [];

  const allLinks = [];
    
  if (originalLinks.length) {
    for (var k=0; k<originalLinks.length; k++) {
      const link = originalLinks[k];

      if (link.url.toLowerCase().indexOf('wms-c') > -1) {
        allLinks.push({ 'type': 'WMS-C', 'url': link.url });
      } else if (link.url.toLowerCase().indexOf('wms') > -1) {
        allLinks.push({ 'type': 'WMS', 'url': link.url });
      } else if (link.url.toLowerCase().indexOf('wmts') > -1) {
        allLinks.push({ 'type': 'WMTS', 'url': link.url });
      } else if (link.url.toLowerCase().indexOf('wfs') > -1) {
        allLinks.push({ 'type': 'WFS', 'url': link.url });
      }
    }
  };        	
   
  return allLinks;

}


export const getDownloadLinks = (md) => {
  if (!md?.link?.length) return;

  const originalLinks = Array.isArray(md?.link) ? md.link.map(l => {
    const lnk = l.split('|');
    return {
      type: lnk[3],      
      url: lnk[2],
      format: lnk[4]
    };
  }) : [];

  const allLinks = [];
    
  if (originalLinks.length) {
    for (var k=0; k<originalLinks.length; k++) {
      const link = originalLinks[k];

      if (link.url.toLowerCase().indexOf('zip') > -1) {
        allLinks.push({ 'type': 'Ficheiro', 'url': link.url });
      } else if (link.url.toLowerCase().indexOf('wfs') > -1) {
        allLinks.push({ 'type': 'WFS', 'url': link.url });
      } else if (link.url.toLowerCase().indexOf('wcs') > -1) {
        allLinks.push({ 'type': 'WCS', 'url': link.url });
      }  else if (link.url.toLowerCase().indexOf('atom') > -1) {
        allLinks.push({ 'type': 'ATOM', 'url': link.url });
      }
    }
  }; 
  
  return allLinks;
}