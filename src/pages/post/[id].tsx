import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import { Box, Flex, Heading, IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useDeletePostMutation, usePostQuery } from '../../codegen/graphql';

const Post = ({}) => {
  const router = useRouter();
  const { data, error, loading } = usePostQuery({
    variables: {
      id: parseInt(router.query.id as string),
    },
  });

  const [deleteFunc] = useDeletePostMutation();

  if (error) {
    return (
      <Layout>
        <div>{error.message}</div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading>{data?.post?.title}</Heading>
      <div> {data?.post?.author.username}</div>
      <Box>{data?.post?.text}</Box>
      <div> {data?.post?.createdAt}</div>
      <Flex>
        <IconButton
          aria-label='delete post'
          icon={<DeleteIcon />}
          onClick={() => {
            deleteFunc({ variables: { deletePostId: data?.post?.id } });
          }}
        />
      </Flex>
    </Layout>
  );
};

export default Post;
