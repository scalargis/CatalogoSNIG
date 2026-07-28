import React from 'react';
import { DatePickerInput, DatesProvider } from '@mantine/dates';
import 'dayjs/locale/pt';

import { formatDate } from '../../utils';

// Mantine's date inputs emit string values; the query builder below needs real
// Date objects (formatDate calls getDate), so bridge string -> Date on change.
const toDate = (value) => (value ? new Date(value) : null);

const DateRangeFilter = ({ id, config, items, onChange }) => {

  const _dates = [items?.length ? items[0] : null, items?.length ? items[1] : null];

  return (
    <DatesProvider settings={{ locale: 'pt' }}>
      <label>{config.label}</label>
      <div className="flex grid">
        <div className="col-6">
          <DatePickerInput placeholder="Data início" clearable
            value={_dates[0]}
            valueFormat="DD/MM/YYYY"
            onChange={(value) => onChange({value: [toDate(value), _dates[1]]})}
          />
        </div>
        <div className="col-6">
          <DatePickerInput placeholder="Data fim" clearable
            value={_dates[1]}
            valueFormat="DD/MM/YYYY"
            onChange={(value) => onChange({value: [_dates[0], toDate(value)]})}
          />
        </div>
      </div>
    </DatesProvider>
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
