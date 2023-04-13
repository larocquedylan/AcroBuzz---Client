import React, { useEffect } from 'react';
import Wrapper from '../components/Wrapper';
import { Box, Button, Textarea } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import router, { useRouter } from 'next/router';
import InputField from '../components/InputField';
import { toErrorMap } from '../utils/toErrorMap';
import NavBar from '../components/NavBar';
import { CreatePostDocument, MeDocument } from '../codegen/graphql';
import { useMutation, useQuery } from 'urql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { userIsAuth } from '../utils/userIsAuth';

const CreatePost: React.FC<{}> = ({}) => {
  userIsAuth();
  const [, createPost] = useMutation(CreatePostDocument);
  const router = useRouter();

  return (
    <>
      <NavBar />
      <Wrapper>
        <Formik
          initialValues={{ title: '', text: '' }}
          onSubmit={async (values, { setErrors }) => {
            console.log('executing...', values);
            try {
              await createPost(values);
              router.push('/');
            } catch (error) {
              router.push('/login');
              alert(`error caught: ${error}`);
            }
            // const response = await createPost(values);
            // if (response.data?.createPost.errors) {
            //   setErrors(toErrorMap(response.data.createPost.errors));
            // } else if (response.data?.createPost.post) {
            //   router.push('/');
            // }

            //   const response = await loginFunc(values);
            //   if (response.data?.login.errors) {
            //     setErrors(toErrorMap(response.data.login.errors));
            //   } else if (response.data?.login.user) {
            //     // worked
            //     router.push('/');
            //   }
          }}
        >
          {({ values }) => (
            <Box border='1px' p={8} rounded='md'>
              <Form>
                <InputField
                  name='title'
                  label='Input'
                  placeholder='Title'
                  type='Input'
                />
                <Box mt={4}>
                  <InputField
                    textarea
                    name='text'
                    label='Pollen'
                    placeholder='What is buzzing in your hive today?'
                  />
                </Box>

                <Button mt={4} colorScheme='orange' type='submit'>
                  Pollinate
                </Button>
              </Form>
            </Box>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
