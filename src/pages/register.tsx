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
import { useMutation } from 'urql';

interface registerProps {}

const REGISTER_MUTATION = `
mutation Register($username: String!, $password: String! ) {
  register(options: {username: $username, password: $password}) {
    errors {
      field
      message
    }
    user {
      _id
      username
    }
  }
}
`;

const Register: React.FC<registerProps> = ({}: registerProps) => {
  const [, registerFunc] = useMutation(REGISTER_MUTATION);
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values) => {
          console.log(values);
          return registerFunc(values);
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
