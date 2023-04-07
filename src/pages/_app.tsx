import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import { AppProps } from 'next/app';
import { Client, cacheExchange, fetchExchange, Provider } from 'urql';
// import { ApolloProvider } from '@apollo/client'

function MyApp({ Component, pageProps }: AppProps) {
  // const apolloClient = useApollo(pageProps)
  const client = new Client({
    url: 'http://localhost:8080/graphql',
    exchanges: [cacheExchange, fetchExchange],
    // include cookies -> credentials: 'include'
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
