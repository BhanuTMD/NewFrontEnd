// import React from "react";
// import Select from "react-select";

// const CustomSelect = ({
//   className,
//   placeholder,
//   field,
//   form,
//   options,
//   isMulti = false,
// }) => {
//   const onChange = (option) => {
//     form.setFieldValue(
//       field.name,
//       isMulti ? option.map((item) => item.value) : option.value
//     );
//   };

//   const getValue = () => {
//     if (options) {
//       return isMulti
//         ? options.filter((option) => field.value.indexOf(option.value) >= 0)
//         : options.find((option) => option.value === field.value);
//     } else {
//       return isMulti ? [] : "";
//     }
//   };

//   return (
//     <Select
//       className={className}
//       name={field.name}
//       value={getValue()}
//       onChange={onChange}
//       placeholder={placeholder}
//       options={options}
//       isMulti={isMulti}
//     />
//   );
// };

// export default CustomSelect;

import React from "react";
import Select from "react-select";

const CustomSelect = ({
  className,
  placeholder,
  field,
  form,
  options,
  isMulti = false,
  defaultValue = [], // Add defaultValue prop
}) => {
  const onChange = (selectedOptions) => {
    // Check if the selectedOptions is an array (for multi-select) or a single object
    const value = isMulti
      ? selectedOptions ? selectedOptions.map((item) => item.value) : [] // Handle case when no options are selected
      : selectedOptions ? selectedOptions.value : ""; // Return an empty string if no option is selected

    form.setFieldValue(field.name, value);
  };

  const getValue = () => {
    if (options) {
      return isMulti
        ? options.filter((option) => {
            // Check if field.value is defined or use defaultValue
            const valuesToCheck = field.value || defaultValue;
            return valuesToCheck.includes(option.value);
          })
        : options.find((option) => option.value === (field.value || defaultValue[0])) || null; // Return null if no match found
    }
    return isMulti ? [] : null; // Return null for single select if no options
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
      isClearable // Allow clearing the selection
    />
  );
};

export default CustomSelect;