import React from 'react';
import { Calendar } from 'primereact/calendar';
import { locale, addLocale } from 'primereact/api';

import { formatDate } from '../../utils';

const DateRangeFilter = ({ id, config, items, onChange }) => {

  addLocale('pt', {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sab', 'Dom'],
    dayNamesMin: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sab', 'Dom'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  });
  
  locale('pt');

  const _dates = [items?.length ? items[0] : null, items?.length ? items[1] : null];

  const child = (
    <div className="p-flex p-grid">
      <div className="p-col-6">
        <Calendar placeholder="Data início" showIcon showButtonBar
          value={_dates[0]}
          locale="pt"
          dateFormat="dd/mm/yy" mask="99/99/9999"
          onChange={(e) => {
            return onChange({value: [e.value,_dates[1]]});
          }}
        />
      </div>
      <div className="p-col-6">
        <Calendar placeholder="Data fim" showIcon showButtonBar
          value={_dates[1]}
          locale="pt"
          dateFormat="dd/mm/yy" mask="99/99/9999"
          onChange={(e) => {
            return onChange({value: [_dates[0], e.value]});
          }}
        />
      </div>
    </div>
  );


  return (
    <React.Fragment>
    {
      config?.float_labels === false ?
      <React.Fragment>
        <label>{config.label}</label>
        {child}
      </React.Fragment> :
      <React.Fragment>
        <label>{config.label}</label>
        {child}
      </React.Fragment>
    }
    </React.Fragment>
  )   

}

DateRangeFilter.getQueryParameters = (items, config) => {
  const params = [null, null];

  if (!items?.length) return;  
  
  if (items[0]) {
    params[0] = formatDate(items[0], 'yyyy-mm-dd');
  }
  if (items[1]) {
    params[1] = formatDate(items[1], 'yyyy-mm-dd');
  }

  return params;
}

export default DateRangeFilter;