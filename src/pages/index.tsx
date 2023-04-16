import {
  Card,
  CardBody,
  CardHeader,
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
        <Link alignSelf={`Center`}>create post</Link>
      </NextLink>

      <br />
      {!data && fetching ? (
        <p>loading.. </p>
      ) : (
        <Stack spacing='4'>
          {allPosts.map((post) => (
            <Card key={post.id} variant={'elevated'}>
              <CardHeader>
                <Heading size='md'>{post.title}</Heading>
                <Text my='2'>Author: {post.author.username} </Text>
              </CardHeader>
              <CardBody>
                <Text>{post.textSnippet}</Text>
              </CardBody>
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
