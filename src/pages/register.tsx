import { Button } from '@chakra-ui/button';
import { Box, Center } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { useRegisterMutation } from '../codegen/graphql';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { toErrorMap } from '../utils/toErrorMap';

interface registerProps {}

const Register: React.FC<registerProps> = ({}: registerProps) => {
  const [register] = useRegisterMutation();
  const router = useRouter();

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          console.log('register request values: ', values);
          const response = await register({ variables: values });
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
      {/* link to login page */}
      <Center mt={4} mx={`auto`}>
        <Button colorScheme='orange' onClick={() => router.push('/login')}>
          Login into your account
        </Button>
      </Center>
    </Wrapper>
  );
};

export default Register;
