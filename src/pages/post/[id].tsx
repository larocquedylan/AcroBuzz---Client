import { withUrqlClient } from 'next-urql';
import React from 'react';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'urql';
import { DeletePostDocument, PostDocument } from '../../codegen/graphql';
import Layout from '../../components/Layout';
import { Box, Flex, Heading, IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const Post = ({}) => {
  const router = useRouter();
  const [{ data, error, fetching }] = useQuery({
    query: PostDocument,
    variables: {
      id: parseInt(router.query.id as string),
    },
  });

  const [, deleteFunc] = useMutation(DeletePostDocument);

  if (error) {
    return (
      <Layout>
        <div>{error.message}</div>
      </Layout>
    );
  }

  if (fetching) {
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
            deleteFunc({ deletePostId: data?.post?.id });
          }}
        />
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
