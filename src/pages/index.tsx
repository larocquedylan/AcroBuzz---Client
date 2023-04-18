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
  MeDocument,
} from '../codegen/graphql';
import Layout from '../components/Layout';
import VoteSection from '../components/VoteSection';
import { createUrqlClient } from '../utils/createUrqlClient';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const Index = () => {
  const [variables, setVariables] = useState<
    Exact<{ cursor?: string; limit?: number }>
  >({ limit: 10 });

  const [{ data: meData }] = useQuery({
    query: MeDocument,
  });

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
                <Box flex={1}>
                  <Flex
                    direction={'row'}
                    width={'max'}
                    justifyContent={'space-between'}
                  >
                    <NextLink href='/post/[id]' as={`/post/${post.id}`}>
                      <Heading size='md' width={'max'} mr={'max'}>
                        {post.title}
                      </Heading>
                    </NextLink>
                    {meData?.me?.userId !== post.author.id ? null : (
                      <Box ml={'max'}>
                        <NextLink
                          href='/post/edit/[id]'
                          as={`/post/edit/${post.id}`}
                        >
                          <IconButton
                            aria-label='edit post'
                            icon={<EditIcon />}
                          />
                        </NextLink>
                        <IconButton
                          aria-label='delete post'
                          ml={4}
                          icon={<DeleteIcon />}
                          onClick={() => {
                            deleteFunc({ deletePostId: post.id });
                          }}
                        />
                      </Box>
                    )}
                  </Flex>
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
