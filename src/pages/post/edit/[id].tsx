import React from 'react';
import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import InputField from '../../../components/InputField';
import Layout from '../../../components/Layout';
import { usePostQuery, useUpdatePostMutation } from '../../../codegen/graphql';

const EditPost = ({}) => {
  const router = useRouter();
  const { data, error, loading } = usePostQuery({
    variables: {
      id: parseInt(router.query.id as string),
    },
  });

  const [updatePost] = useUpdatePostMutation();

  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  return (
    <>
      <Layout variant='regular'>
        <Formik
          initialValues={{ title: data.post.title, text: data.post.text }}
          onSubmit={async (values) => {
            await updatePost({
              variables: {
                id: parseInt(router.query.id as string),
                ...values,
              },
            });
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
                  Update
                </Button>
              </Form>
            </Box>
          )}
        </Formik>
      </Layout>
    </>
  );
};

export default EditPost;
