import { withUrqlClient } from 'next-urql';
import React from 'react';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useRouter } from 'next/router';
import { useQuery } from 'urql';
import { PostDocument } from '../../codegen/graphql';
import Layout from '../../components/Layout';
import { Box, Heading } from '@chakra-ui/react';

const Post = ({}) => {
  const router = useRouter();
  const [{ data, error, fetching }] = useQuery({
    query: PostDocument,
    variables: {
      id: parseInt(router.query.id as string),
    },
  });

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
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
