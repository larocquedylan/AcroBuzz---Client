import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { useCreatePostMutation } from '../codegen/graphql';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import { userIsAuth } from '../utils/userIsAuth';

const CreatePost: React.FC<{}> = ({}) => {
  userIsAuth();
  const [createPost, { error }] = useCreatePostMutation();
  const router = useRouter();

  return (
    <>
      <Layout variant='regular'>
        <Formik
          initialValues={{ title: '', text: '' }}
          onSubmit={async (values) => {
            try {
              await createPost({
                variables: values,
                update: (cache) => {
                  cache.evict({ fieldName: 'posts:{}' });
                },
              });
              router.push('/');
            } catch (error) {
              router.push('/login');
              alert(`error caught: ${error.message}`);
            }
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
      </Layout>
    </>
  );
};

export default CreatePost;
