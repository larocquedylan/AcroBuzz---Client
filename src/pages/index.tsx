import NavBar from '../components/NavBar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { GetPaginatedPostsDocument, Exact } from '../codegen/graphql';
import { useQuery } from 'urql';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';
import { useState } from 'react';

const Index = () => {
  const [variables, setVariables] = useState<
    Exact<{ cursor?: string; limit?: number }>
  >({ limit: 10 });
  const [{ data, fetching }] = useQuery({
    query: GetPaginatedPostsDocument,
    variables,
  });

  const loadMorePosts = () => {
    if (data && data.posts.nextCursor) {
      setVariables({ cursor: data.posts.nextCursor, limit: 10 });
    }
  };

  return (
    <Layout>
      <NextLink href={'/create-post'}>
        <Link>create post</Link>
      </NextLink>

      <br />
      {!data && fetching ? (
        <p>loading.. </p>
      ) : (
        data.posts.posts.map((post) => <div key={post.id}> {post.title}</div>)
      )}
      {data && data.posts.nextCursor && (
        <button onClick={loadMorePosts}>Load More</button>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);

// const Index = () => {
//   const [variables, setVariables] = useState({ input: { limit: 10 } });
//   const [{ data, fetching }] = useQuery({
//     query: GetPaginatedPostsDocument,
//     variables,
//   });

//   const loadMorePosts = () => {
//     if (data && data.posts.nextCursor) {
//       setVariables({ input: { cursor: data.posts.nextCursor, limit: 10 } });
//     }
//   };

//   return (
//     <Layout>
//       <NextLink href={'/create-post'}>
//         <Link>create post</Link>
//       </NextLink>

//       <br />
//       {!data && fetching ? (
//         <p>loading.. </p>
//       ) : (
//         data.posts.map((post) => <div key={post.id}> {post.title}</div>)
//       )}
//     </Layout>
//   );
// };

// export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
