import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Card,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import {
  Exact,
  useDeletePostMutation,
  useGetPaginatedPostsQuery,
  useMeQuery,
} from '../codegen/graphql';
import Layout from '../components/Layout';
import VoteSection from '../components/VoteSection';

const Index = () => {
  const [variables, setVariables] = useState<
    Exact<{ cursor?: string; limit?: number }>
  >({ limit: 10 });

  const { data: meData } = useMeQuery();

  const { data, loading, fetchMore } = useGetPaginatedPostsQuery({ variables });

  const [deletePost] = useDeletePostMutation();

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
      fetchMore({
        variables: { cursor: data.posts.nextCursor, limit: 10 },
      });
    }
  };

  return (
    <Layout>
      {!data && loading ? (
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
                    {meData?.me?.id !== post.author.id ? null : (
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
                            deletePost({
                              variables: { deletePostId: post.id },
                            });
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

export default Index;
function fetchMore(arg0: { variables: { cursor: any; limit: number } }) {
  throw new Error('Function not implemented.');
}
