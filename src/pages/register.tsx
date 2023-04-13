import React from 'react';
import { Formik, Field, Form } from 'formik';
import { Button } from '@chakra-ui/button';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { Box, border } from '@chakra-ui/react';
import { useMutation } from 'urql';
import { RegisterDocument } from '../codegen/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface registerProps {}

const Register: React.FC<registerProps> = ({}: registerProps) => {
  const [, registerFunc] = useMutation(RegisterDocument);
  const router = useRouter();

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          console.log('register request values: ', values);
          const response = await registerFunc(values);
          console.log('register response: ', response);
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            // worked
            router.push('/');
          }
        }}
      >
        {({ values }) => (
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

              <Button mt={4} colorScheme='orange' type='submit'>
                Register
              </Button>
            </Form>
          </Box>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
