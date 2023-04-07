import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Button } from '@chakra-ui/button';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { Box, border } from '@chakra-ui/react';
import { useMutation } from 'urql';
import { RegisterDocument } from '../codegen/graphql';

interface registerProps {}

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  password: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});

const Register: React.FC<registerProps> = ({}: registerProps) => {
  const [, registerFunc] = useMutation(RegisterDocument);

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={SignupSchema}
        onSubmit={async (values) => {
          console.log(values);
          const response = await registerFunc(values);
          // if (response.data?.register.errors) {
          //   setErrors()
          // }
          // const errors = response.data?.register.errors;
          // console.log(errors);
          // const user = response.data?.register.user;
        }}
      >
        {({ values, handleChange, errors, touched }) => (
          <Box border='1px' p={8} rounded='md'>
            <Form>
              <InputField
                name='username'
                label='Username'
                placeholder='username'
              />
              {/* {errors.username && touched.username ? (
                <div>hey!{errors.username}</div>
              ) : null} */}
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

export default Register;
