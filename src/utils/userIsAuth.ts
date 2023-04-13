import router from 'next/router';
import { useEffect } from 'react';
import { useQuery } from 'urql';
import { MeDocument } from '../codegen/graphql';

export const userIsAuth = () => {
  const [{ data, fetching }] = useQuery({
    query: MeDocument,
  });

  useEffect(() => {
    if (!fetching && !data?.me) {
      router.push('/login');
    }
  }, [data, fetching, router]);
};
