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
      // If user is not auth, redirect to login page and then back to the page they were on after log in
      // router.replace('/login?=next' + router.pathname);
      router.replace(`/login?next=${router.pathname}`);
    }
  }, [data, fetching, router]);
};
