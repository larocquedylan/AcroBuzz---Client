import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { Exact, GetPaginatedPostsDocument } from '../codegen/graphql';
import Layout from '../components/Layout';
import { createUrqlClient } from '../utils/createUrqlClient';
import { IconButton } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import VoteSection from '../components/VoteSection';

const Index = () => {
  const [variables, setVariables] = useState<
    Exact<{ cursor?: string; limit?: number }>
  >({ limit: 10 });
  const [{ data, fetching }] = useQuery({
    query: GetPaginatedPostsDocument,
    variables,
  });

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
      <NextLink href={'/create-post'}>
        <Box alignSelf={`Center`}>create post</Box>
      </NextLink>

      <br />
      {!data && fetching ? (
        <p>loading.. </p>
      ) : (
        <Stack spacing='6'>
          {allPosts.map((post) => (
            <Card key={post.id} variant={'elevated'} padding={8}>
              <NextLink href='/post/[id]' as={`/post/${post.id}`}>
                <Flex>
                  <VoteSection post={post} />
                  <Box>
                    <Heading size='md'>{post.title}</Heading>
                    <Text my='2'>Author: {post.author.username} </Text>
                    <Text>{post.textSnippet}</Text>
                  </Box>
                </Flex>
              </NextLink>
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
