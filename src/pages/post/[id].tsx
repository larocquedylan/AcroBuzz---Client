import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import { Box, Card, Flex, Heading, IconButton } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  useDeletePostMutation,
  useMeQuery,
  usePostQuery,
} from '../../codegen/graphql';
import NextLink from 'next/link';

const Post = ({}) => {
  const router = useRouter();

  const { data: meData } = useMeQuery();

  const { data, error, loading } = usePostQuery({
    variables: {
      id: parseInt(router.query.id as string),
    },
  });

  const [deletePost] = useDeletePostMutation();

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
      <Card variant={'elevated'} padding={8}>
        <Heading>{data?.post?.title}</Heading>
        <div> {data?.post?.author.username}</div>
        <Box mt={2}>{data?.post?.text}</Box>
        <div> {data?.post?.createdAt}</div>
        {meData?.me?.id !== data?.post?.author.id ? null : (
          <Box mt={2}>
            <NextLink
              href='/post/edit/[id]'
              as={`/post/edit/${data?.post?.id}`}
            >
              <IconButton aria-label='edit post' icon={<EditIcon />} />
            </NextLink>
            <IconButton
              aria-label='delete post'
              ml={4}
              icon={<DeleteIcon />}
              onClick={() => {
                deletePost({
                  variables: { deletePostId: data?.post?.id },
                });
              }}
            />
          </Box>
        )}
      </Card>
    </Layout>
  );
};

export default Post;
