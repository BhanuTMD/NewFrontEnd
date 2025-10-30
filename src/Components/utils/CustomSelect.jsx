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

// import React from "react";
// import Select from "react-select";

// const CustomSelect = ({
//   className,
//   placeholder,
//   field,
//   form,
//   options,
//   isMulti = false,
//   defaultValue = [], // Add defaultValue prop
// }) => {
//   const onChange = (selectedOptions) => {
//     // Check if the selectedOptions is an array (for multi-select) or a single object
//     const value = isMulti
//       ? selectedOptions ? selectedOptions.map((item) => item.value) : [] // Handle case when no options are selected
//       : selectedOptions ? selectedOptions.value : ""; // Return an empty string if no option is selected

//     form.setFieldValue(field.name, value);
//   };

//   const getValue = () => {
//     if (options) {
//       return isMulti
//         ? options.filter((option) => {
//             // Check if field.value is defined or use defaultValue
//             const valuesToCheck = field.value || defaultValue;
//             return valuesToCheck.includes(option.value);
//           })
//         : options.find((option) => option.value === (field.value || defaultValue[0])) || null; // Return null if no match found
//     }
//     return isMulti ? [] : null; // Return null for single select if no options
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
//       isClearable // Allow clearing the selection
//     />
//   );
// };

// export default CustomSelect;

// File: ../utils/CustomSelect.js (or your path)

import React from "react";
import Select from "react-select";

const CustomSelect = ({
  className,
  placeholder,
  field, // Provided by <Field component={CustomSelect} />
  form,  // Provided by <Field component={CustomSelect} />
  options,
  isMulti = false,
}) => {

  // --- CORRECTED onChange ---
  // Sets the entire selected option object (or array of objects) into Formik state
  const onChange = (option) => {
    form.setFieldValue(
      field.name,
      option // Pass the raw object(s) received from react-select
    );
  };

  // --- CORRECTED getValue ---
  // Finds the selected option object(s) within the options list
  // based on the object(s) currently stored in Formik's field.value
  const getValue = () => {
    if (options) {
      if (isMulti) {
        // field.value is expected to be an array of objects [{value, label}, ...] or null/undefined
        // Filter options based on whether their value exists in field.value's array
        return options.filter(option =>
            Array.isArray(field.value) && // Ensure field.value is an array
            field.value.some(fv => fv && fv.value === option.value) // Check if any object in field.value matches the current option's value
        );
      } else {
        // field.value is expected to be a single object {value, label} or null/undefined
        // Find the option whose value matches field.value's value property
        return options.find(option => option.value === field.value?.value); // Safely access .value
      }
    }
    // Return default empty state if no options or no match
    return isMulti ? [] : null;
  };

  return (
    <Select
      className={className} // Pass className for styling
      name={field.name}
      value={getValue()} // Use corrected getValue
      onChange={onChange} // Use corrected onChange
      placeholder={placeholder}
      options={options}
      isMulti={isMulti}
      isClearable // Good to keep
      // Add error styling if needed, e.g., based on form.errors and form.touched
      // classNamePrefix="react-select" // Useful for custom styling
    />
  );
};

export default CustomSelect;