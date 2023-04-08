import NavBar from '../components/NavBar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { PostsDocument } from '../codegen/graphql';
import { useQuery } from 'urql';

const Index = () => {
  const [{ data, fetching }] = useQuery({
    query: PostsDocument,
  });

  return (
    <>
      <NavBar />
      <div> Hello World</div>
      {!data && fetching ? (
        <p>loading.. </p>
      ) : (
        data.posts.map((post) => <div key={post._id}> {post.title}</div>)
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
