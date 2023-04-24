import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import {
  GetPaginatedPostsDocument,
  useDeletePostMutation,
  useGetPaginatedPostsQuery,
  useMeQuery,
} from '../codegen/graphql';
import Layout from '../components/Layout';
import VoteSection from '../components/VoteSection';

const Index = () => {
  const { data: meData } = useMeQuery();

  const { data, loading, fetchMore, variables } = useGetPaginatedPostsQuery({
    variables: {
      limit: 10,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [deletePost] = useDeletePostMutation({
    refetchQueries: [
      {
        query: GetPaginatedPostsDocument,
        variables: { limit: 10, cursor: null },
      },
    ],
  });
  const isLoadingMore = loading && data;

  return (
    <Layout>
      {!data && loading ? (
        <p>loading.. </p>
      ) : (
        <Stack spacing='6' maxW={800}>
          {data.posts.posts.map((post) => (
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
        <Center mt={4} mb={4} padding={'2'}>
          <Button
            variant={'outline'}
            colorScheme='orange'
            _hover={{
              transform: 'translateY(-5px)',
              boxShadow: 'lg',
            }}
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor: data.posts.nextCursor,
                },
              });
            }}
          >
            {isLoadingMore ? <Spinner /> : 'Load more'}
          </Button>
        </Center>
      )}
    </Layout>
  );
};

export default Index;
