import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import { AppProps } from 'next/app';
import { Client, fetchExchange, Provider } from 'urql';
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';
import {
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from '../codegen/graphql';

// import { ApolloProvider } from '@apollo/client'

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

const cacheUpdate = {
  updates: {
    Mutation: {
      login: (_result, args, cache, info) => {
        betterUpdateQuery<LoginMutation, MeQuery>(
          cache,
          { query: MeDocument },
          _result,
          (result, query) => {
            if (result.login.errors) {
              return query;
            } else {
              return {
                me: result.login.user,
              };
            }
          }
        );
      },
      register: (_result, args, cache, info) => {
        betterUpdateQuery<RegisterMutation, MeQuery>(
          cache,
          { query: MeDocument },
          _result,
          (result, query) => {
            if (result.register.errors) {
              return query;
            } else {
              return {
                me: result.register.user,
              };
            }
          }
        );
      },
    },
  },
};

function MyApp({ Component, pageProps }: AppProps) {
  // const apolloClient = useApollo(pageProps)
  const client = new Client({
    url: 'http://localhost:8080/graphql',
    exchanges: [cacheExchange(cacheUpdate), fetchExchange],
    fetchOptions() {
      return {
        credentials: 'include',
      };
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <Provider value={client}>
        <Component {...pageProps} />
      </Provider>
      {/* <ApolloProvider client={client}> */}
      {/* <ClientOnly> */}
      {/* <Component {...pageProps} /> */}
      {/* </ClientOnly> */}
      {/* </ApolloProvider> */}
    </ChakraProvider>
  );
}

export default MyApp;
