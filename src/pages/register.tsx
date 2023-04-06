import React from 'react';
import { Formik, Field, Form } from 'formik';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Button } from '@chakra-ui/button';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { Box, border } from '@chakra-ui/react';

interface registerProps {}

// The below import defines which components come from formik
// import { Field, Form, Formik } from 'formik';

const Register: React.FC<registerProps> = ({}: registerProps) => {
  // function handleChange(e: any) {
  //   e.preventDefault();
  //   const { name, value } = e.target;
  //   }
  // }

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ values, handleChange }) => (
          <Box border='1px' p={8} rounded='md'>
            <Form>
              <InputField
                name='username'
                label='Username'
                placeholder='username'
              />
              <Box mt={4}>
                <InputField
                  name='password'
                  label='Password'
                  placeholder='password'
                  type='password'
                />
              </Box>

              <Button
                mt={4}
                colorScheme='orange'
                // isLoading={values.isSubmitting}
                type='submit'
              >
                Register
              </Button>
            </Form>
          </Box>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
