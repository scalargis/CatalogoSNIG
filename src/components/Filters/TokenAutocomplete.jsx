import React, { useState } from 'react';
import { Combobox, Pill, PillsInput, ScrollArea, useCombobox } from '@mantine/core';

/*
 * The Prime <AutoComplete multiple> twin used by every catalog filter: a
 * tokenised multi-select with async suggestions, optional show-all-on-focus
 * dropdown, and optional free-text entry. Values are the same shape the old
 * filters stored — plain strings when `field` is unset, or objects displayed
 * through `field` (e.g. {code, name} with field="name"). The parent owns the
 * suggestion list and fetches it in `onSearch`, exactly like Prime's
 * completeMethod; onChange emits Prime's { value } shape.
 */

const displayOf = (item, field) => {
  if (item == null) return '';
  return field ? (item[field] ?? '') : item;
};

const sameItem = (a, b, field) =>
  String(displayOf(a, field)).toLowerCase() === String(displayOf(b, field)).toLowerCase();

export default function TokenAutocomplete({
  id,
  className,
  label,
  value,
  field,
  suggestions,
  onSearch,
  onChange,
  placeholder,
  dropdown = false,
  allowFreeText = false,
}) {
  const selected = Array.isArray(value) ? value : [];
  const options = Array.isArray(suggestions) ? suggestions : [];

  const [search, setSearch] = useState('');

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const emit = (next) => onChange({ value: next });

  const addItem = (item) => {
    if (selected.some((s) => sameItem(s, item, field))) return;
    emit([...selected, item]);
  };

  const removeAt = (index) => emit(selected.filter((_, i) => i !== index));

  const commitFreeText = () => {
    const val = search.trim();
    if (!val) return;
    const item = field ? { code: val, [field]: val } : val;
    if (!selected.some((s) => sameItem(s, item, field))) {
      emit([...selected, item]);
    }
    setSearch('');
  };

  const pills = selected.map((item, index) => (
    <Pill key={index} withRemoveButton onRemove={() => removeAt(index)}>
      {displayOf(item, field)}
    </Pill>
  ));

  const optionNodes = options.map((item, index) => (
    <Combobox.Option value={String(index)} key={index}>
      {displayOf(item, field)}
    </Combobox.Option>
  ));

  return (
    <React.Fragment>
      {label != null && <label htmlFor={id} className="token-autocomplete-label">{label}</label>}
      <Combobox
        store={combobox}
        onOptionSubmit={(optionIndex) => {
          const item = options[parseInt(optionIndex)];
          if (item) addItem(item);
          setSearch('');
          combobox.closeDropdown();
        }}
      >
        <Combobox.DropdownTarget>
          <PillsInput id={id} className={className} onClick={() => combobox.openDropdown()}>
            <Pill.Group>
              {pills}
              <Combobox.EventsTarget>
                <PillsInput.Field
                  value={search}
                  placeholder={placeholder}
                  onFocus={() => {
                    combobox.openDropdown();
                    if (dropdown) onSearch({ query: '' });
                  }}
                  onBlur={() => {
                    combobox.closeDropdown();
                    if (allowFreeText) commitFreeText();
                  }}
                  onChange={(e) => {
                    combobox.openDropdown();
                    combobox.updateSelectedOptionIndex();
                    setSearch(e.currentTarget.value);
                    onSearch({ query: e.currentTarget.value });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && search.length === 0 && selected.length > 0) {
                      e.preventDefault();
                      removeAt(selected.length - 1);
                    }
                  }}
                />
              </Combobox.EventsTarget>
            </Pill.Group>
          </PillsInput>
        </Combobox.DropdownTarget>

        <Combobox.Dropdown>
          <Combobox.Options>
            {optionNodes.length > 0
              ? <ScrollArea.Autosize mah={260} type="scroll">{optionNodes}</ScrollArea.Autosize>
              : <Combobox.Empty>Sem resultados</Combobox.Empty>}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </React.Fragment>
  );
}
