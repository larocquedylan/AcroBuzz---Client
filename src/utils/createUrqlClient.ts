import { cacheExchange } from '@urql/exchange-graphcache';
import inspectFields from '@urql/exchange-graphcache';
import router from 'next/router';
import { Exchange, fetchExchange } from 'urql';
import { gql } from '@urql/core';
import { pipe, tap } from 'wonka';
import {
  GetPaginatedPostsDocument,
  GetPaginatedPostsQuery,
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
  VoteMutationVariables,
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
    cookie = ctx?.req?.headers?.cookie;
  }

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
          keys: {
            PaginatedPosts: () => null, // Add this line
          },
          Mutation: {
            vote: (_result, args, cache, info) => {
              console.log('🚀 ~ Vote args:', args);

              const allFields = cache.inspectFields('Query');
              console.log(
                '🚀 ~ file: createUrqlClient.ts:56 ~ createUrqlClient ~ allFields:',
                allFields
              );

              const { postId, voteValue } = args as VoteMutationVariables;

              // Log the cache contents
              const cacheData = cache.resolve(
                { __typename: 'Post', id: postId },
                'totalPoints'
              );
              console.log('🚀 ~ Cache data:', cacheData);

              const postCacheData = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    totalPoints
                  }
                `,
                { id: postId }
              ) as { id: number; totalPoints: number } | null;

              console.log(
                '🚀 ~ file: createUrqlClient.ts:64 ~ createUrqlClient ~ postCacheData:',
                postCacheData
              );

              if (postCacheData) {
                const updatedPoints = postCacheData.totalPoints + voteValue;
                cache.writeFragment(
                  gql`
                    fragment _ on Post {
                      totalPoints
                    }
                  `,
                  { id: postId, totalPoints: updatedPoints }
                );
              }
            },

            createPost: (_result, args, cache, info) => {
              const allFields = cache.inspectFields('Query');
              const postQueries = allFields.filter(
                ({ fieldName }) => fieldName === 'posts'
              );
              postQueries.forEach(({ arguments: queryArgs }) => {
                cache.invalidate('Query', 'posts', queryArgs);
              });
            },
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
