// import {
//   FormControl,
//   FormLabel,
//   FormErrorMessage,
// } from '@chakra-ui/form-control';
// import { Input } from '@chakra-ui/input';
// import { Textarea } from '@chakra-ui/react';
// import { useField } from 'formik';
// import React, { InputHTMLAttributes } from 'react';

// type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
//   name: string;
//   label: string;
//   placeholder: string;
//   textarea?: boolean;
// };

// const InputField: React.FC<InputFieldProps> = (props) => {
//   // make input field a text area if textarea is true
//   const InputOrText: React.ElementType = Textarea ? Input : Textarea;

//   const [field, { error }] = useField(props);
//   return (
//     // !! converts error to boolean, if empty string, it will be false, if not empty, it will be true
//     <FormControl isInvalid={!!error}>
//       <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
//       <InputOrText
//         {...field}
//         id={field.name}
//         placeholder={props.placeholder}
//         type={props.type}
//       />
//       {/* if error message is truthy, display, if not null */}
//       {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
//     </FormControl>
//   );
// };

// export default InputField;

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Textarea } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  placeholder: string;
  textarea?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({ textarea, ...props }) => {
  // make input field a text area if textarea is true
  const InputOrText: React.ElementType = textarea ? Textarea : Input;

  const [field, { error }] = useField(props);
  return (
    // !! converts error to boolean, if empty string, it will be false, if not empty, it will be true
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <InputOrText
        {...field}
        id={field.name}
        placeholder={props.placeholder}
        type={props.type}
      />
      {/* if error message is truthy, display, if not null */}
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export default InputField;
