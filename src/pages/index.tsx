import NavBar from '../components/NavBar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { PostsDocument } from '../codegen/graphql';
import { useQuery } from 'urql';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';

const Index = () => {
  const [{ data, fetching }] = useQuery({
    query: PostsDocument,
  });

  return (
    <Layout>
      <NextLink href={'/create-post'}>
        <Link>create post</Link>
      </NextLink>

      <br />
      {!data && fetching ? (
        <p>loading.. </p>
      ) : (
        data.posts.map((post) => <div key={post.id}> {post.title}</div>)
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
