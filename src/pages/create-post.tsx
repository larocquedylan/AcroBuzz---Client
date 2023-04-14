import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { useMutation } from 'urql';
import { CreatePostDocument } from '../codegen/graphql';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import { createUrqlClient } from '../utils/createUrqlClient';
import { userIsAuth } from '../utils/userIsAuth';

const CreatePost: React.FC<{}> = ({}) => {
  userIsAuth();
  const [, createPost] = useMutation(CreatePostDocument);
  const router = useRouter();

  return (
    <>
      <Layout variant='regular'>
        <Formik
          initialValues={{ title: '', text: '' }}
          onSubmit={async (values) => {
            const { error } = await createPost(values);
            if (error) {
              router.push('/login');
              alert(`error caught: ${error}`);
            }
            router.push('/');
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

export default withUrqlClient(createUrqlClient)(CreatePost);
