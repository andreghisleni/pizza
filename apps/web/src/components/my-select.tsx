/* eslint-disable @typescript-eslint/no-explicit-any */

import { GroupBase, Options, OptionsOrGroups } from 'react-select'

import { ReactSelect } from './Select'

interface MySelectProps<Option, Group extends GroupBase<Option>> {
  options: OptionsOrGroups<Option, Group>

  value: string[] | string | null | undefined

  onChange: (value: string[] | string | null) => void

  disabled?: boolean

  isMulti?: boolean

  className?: string

  placeholder?: string

  menuPosition?: 'absolute' | 'fixed'
  isOptionSelected?: (option: Option, selectValue: Options<Option>) => boolean

  id?: string

  closeMenuOnSelect?: boolean
}

export function MySelect({
  options,
  value,
  onChange,
  disabled,
  isMulti,
  className,
  placeholder,
  menuPosition,
  isOptionSelected,
  id,
  closeMenuOnSelect,
}: MySelectProps<any, any>) {
  return (
    <ReactSelect
      id={id}
      className={className}
      defaultValue={options.filter((option) =>
        isMulti ? value?.includes(option.value) : value === option.value,
      )}
      value={options.filter((option) =>
        isMulti ? value?.includes(option.value) : value === option.value,
      )}
      onChange={(v: any) => {
        // console.log(v); // eslint-disable-line no-console

        isMulti ? onChange(v.map((vv: any) => vv.value)) : onChange(v.value)
      }}
      options={options}
      isDisabled={disabled}
      closeMenuOnSelect={closeMenuOnSelect}
      isMulti={isMulti}
      placeholder={placeholder ?? 'Select...'}
      menuPosition={menuPosition}
      isOptionSelected={isOptionSelected}
    />
  )
}
