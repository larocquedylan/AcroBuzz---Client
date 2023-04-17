import {
  Box,
  Card,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';
import {
  DeletePostDocument,
  Exact,
  GetPaginatedPostsDocument,
} from '../codegen/graphql';
import Layout from '../components/Layout';
import VoteSection from '../components/VoteSection';
import { createUrqlClient } from '../utils/createUrqlClient';
import { DeleteIcon } from '@chakra-ui/icons';

const Index = () => {
  const [variables, setVariables] = useState<
    Exact<{ cursor?: string; limit?: number }>
  >({ limit: 10 });
  const [{ data, fetching }] = useQuery({
    query: GetPaginatedPostsDocument,
    variables,
  });

  const [, deleteFunc] = useMutation(DeletePostDocument);

  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    if (data && data.posts.posts) {
      setAllPosts((prevPosts) => {
        // Merge the previous and new data
        const combinedPosts = [...prevPosts, ...data.posts.posts];
        // Remove duplicates
        return combinedPosts.filter(
          (post, index, self) =>
            self.findIndex((p) => p.id === post.id) === index
        );
      });
    }
  }, [data]);

  const loadMorePosts = () => {
    if (data && data.posts.nextCursor) {
      setVariables({ cursor: data.posts.nextCursor, limit: 10 });
    }
  };

  return (
    <Layout>
      {!data && fetching ? (
        <p>loading.. </p>
      ) : (
        <Stack spacing='6' maxW={800}>
          {allPosts.map((post) => (
            <Card key={post.id} variant={'elevated'} padding={8}>
              <Flex>
                <VoteSection post={post} />
                <Box>
                  <NextLink href='/post/[id]' as={`/post/${post.id}`}>
                    <Heading size='md'>{post.title}</Heading>
                  </NextLink>
                  <IconButton
                    aria-label='delete post'
                    icon={<DeleteIcon />}
                    onClick={() => {
                      deleteFunc({ deletePostId: post.id });
                    }}
                  />
                  <Text my='2'>Author: {post.author.username} </Text>
                  <Text>{post.textSnippet}</Text>
                </Box>
              </Flex>
            </Card>
          ))}
        </Stack>
      )}
      {data && data.posts.nextCursor && (
        <button onClick={loadMorePosts}>Load More</button>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
