import React from "react";
import Select from "react-select";

const CustomSelect = ({
  className,
  placeholder,
  field,
  form,
  options,
  isMulti = false,
}) => {
  const onChange = (option) => {
    form.setFieldValue(field.name, option); // ← store full object(s)
  };

  const getValue = () => {
    return field.value || (isMulti ? [] : null);
  };

  return (
    <Select
      className={className}
      name={field.name}
      value={getValue()}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      isMulti={isMulti}
      isClearable
    />
  );
};

export default CustomSelect;
