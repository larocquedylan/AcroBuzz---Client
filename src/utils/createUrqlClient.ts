import { Resolver, cacheExchange } from '@urql/exchange-graphcache';
import inspectFields from '@urql/exchange-graphcache';
import router from 'next/router';
import { Exchange, fetchExchange, stringifyVariables } from 'urql';
import { AnyVariables, TypedDocumentNode, gql } from '@urql/core';
import { pipe, tap } from 'wonka';
import {
  Exact,
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

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      'posts'
    );
    info.partial = !isItInTheCache;
    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, 'posts') as string[];
      const _hasMore = cache.resolve(key, 'hasMore');
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    });

    return {
      __typename: 'PaginatedPosts',
      hasMore,
      posts: results,
    };
  };
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = '';
  if (isServerSide) {
    cookie = ctx?.req?.headers?.cookie;
  }

  return {
    url: process.env.NEXT_PUBLIC_API_URL,
    fetchOptions() {
      if (isServerSide && ctx?.req?.headers?.cookie) {
        return {
          credentials: 'include' as const,
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
        keys: {
          PaginatedPosts: () => null,
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
            deletePost: (_result, args, cache, _info) => {
              const allFields = cache.inspectFields('Query');
              const postFields = allFields.filter(
                (field) => field.fieldName === 'posts'
              );

              postFields.forEach((field) => {
                cache.invalidate('Query', 'posts', field.arguments);
              });
            },
            vote: (_result, args, cache, _info) => {
              const { postId } = args as VoteMutationVariables;
              cache.invalidate({ __typename: 'Post', id: postId });
            },
            createPost: (
              _result: any,
              args: any,
              cache: {
                inspectFields: (arg0: string) => any;
                invalidate: (arg0: string, arg1: string, arg2: any) => void;
              },
              info: any
            ) => {
              const allFields = cache.inspectFields('Query');
              console.log(allFields);
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === 'posts'
              );
              console.log(fieldInfos);
              fieldInfos.forEach((fi) => {
                cache.invalidate('Query', 'posts', fi.arguments || {});
              });
            },

            logout: (
              _result: any,
              args: any,
              cache: inspectFields.Cache,
              info: any
            ) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              );
            },

            login: (
              _result: any,
              args: any,
              cache: inspectFields.Cache,
              info: any
            ) => {
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

            register: (
              _result: any,
              args: any,
              cache: inspectFields.Cache,
              info: any
            ) => {
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
