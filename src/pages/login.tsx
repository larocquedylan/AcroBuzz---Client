import React from 'react';
import { Formik, Field, Form } from 'formik';
import { Button } from '@chakra-ui/button';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { Box } from '@chakra-ui/react';
import { useLoginMutation } from '../codegen/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';

const Login: React.FC<{}> = ({}) => {
  const [login] = useLoginMutation();
  const router = useRouter();

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ variables: values });

          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === 'string') {
              router.push(router.query.next);
            } else {
              router.push('/');
            }
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
                Login
              </Button>
            </Form>
          </Box>
        )}
      </Formik>

      {/* link to register page */}
      <Box mt={4} mx={`auto`}>
        <Button colorScheme='orange' onClick={() => router.push('/register')}>
          Register
        </Button>
      </Box>
    </Wrapper>
  );
};

export default Login;
