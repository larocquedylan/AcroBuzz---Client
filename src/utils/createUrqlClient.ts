import { cacheExchange } from '@urql/exchange-graphcache';
import router from 'next/router';
import { Exchange, fetchExchange } from 'urql';
import { pipe, tap } from 'wonka';
import {
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from '../codegen/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { isServerSide } from './isServerSide';

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.includes('not authenticated')) {
          router.replace('/login');
          console.log('🚀 ~ file: createUrqlClient.ts:20 ~ error', error);
        }
      })
    );
  };

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = '';
  if (isServerSide) {
    // console.log(
    //   '🚀 ~ file: createUrqlClient.ts:16~ isServerSide: if(isServerSide) true',
    //   isServerSide
    // );
    cookie = ctx?.req?.headers?.cookie;
  }
  // console.log(
  //   '🚀 ~ file: createUrqlClient.ts:20 ~ createUrqlClient ~ isServerSide: false ',
  //   isServerSide
  // );

  return {
    url: 'http://localhost:8080/graphql',
    fetchOptions() {
      if (isServerSide && ctx?.req?.headers?.cookie) {
        return {
          headers: {
            cookie: ctx.req.headers.cookie,
          },
        };
      }
      return {
        credentials: 'include' as const,
      };
    },
    exchanges: [
      cacheExchange({
        updates: {
          Mutation: {
            logout: (_result, args, cache, info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              );
            },
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
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
