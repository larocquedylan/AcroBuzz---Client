import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../codegen/graphql';

export const userIsAuth = () => {
  const { data, loading } = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !data?.me) {
      router.replace(`/login?next=${router.pathname}`);
    }
  }, [data, loading, router]);
};
