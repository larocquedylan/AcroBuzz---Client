import { Resolver, cacheExchange, Cache } from '@urql/exchange-graphcache';
import inspectFields from '@urql/exchange-graphcache';
import router from 'next/router';
import { Exchange, fetchExchange, stringifyVariables } from 'urql';
import { AnyVariables, gql } from '@urql/core';
import { pipe, tap } from 'wonka';
import {
  Exact,
  GetPaginatedPostsDocument,
  GetPaginatedPostsQuery,
  LoginMutation,
  MeDocument,
  MeQuery,
  PaginatedPosts,
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
      info.partial = true;
      return;
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

function invalidateAllPosts(cache: Cache) {
  const allFields = cache.inspectFields('Query');
  const fieldInfos = allFields.filter((info) => info.fieldName === 'posts');
  fieldInfos.forEach((fi) => {
    cache.invalidate('Query', 'posts', fi.arguments || null);
  });
}

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = '';
  if (isServerSide) {
    cookie = ctx?.req?.headers?.cookie;
  }

  return {
    url: process.env.NEXT_PUBLIC_API_URL,
    fetchOptions: {
      credentials: 'include' as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
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

            vote: (result, args, cache) => {
              const { postId, voteValue } = args as VoteMutationVariables;
              console.log('Vote function called with postId:', postId);

              const allFields = cache.inspectFields('Query');
              const postFields = allFields.filter(
                (field) => field.fieldName === 'posts'
              );

              console.log('All fields:', allFields);

              postFields.forEach((field) => {
                console.log('Field:', field);
                const currentData = cache.readQuery<GetPaginatedPostsQuery>({
                  query: GetPaginatedPostsDocument,
                  variables: field.arguments,
                });

                console.log(currentData);

                if (currentData?.posts?.posts) {
                  const updatedPosts = currentData.posts.posts.map((post) => {
                    if (post.id === postId) {
                      console.log('Updating totalPoints for postId:', postId);
                      return {
                        ...post,
                        totalPoints: post.totalPoints + voteValue,
                      };
                    }
                    return post;
                  });

                  console.log('Updated posts:', updatedPosts);

                  cache.updateQuery(
                    {
                      query: GetPaginatedPostsDocument,
                      variables: field.arguments,
                    },
                    (data: GetPaginatedPostsQuery | null) => {
                      if (!data) {
                        console.log(
                          'Data not found in cache for fieldKey:',
                          field.fieldKey
                        );
                        return null;
                      }

                      return {
                        ...data,
                        posts: {
                          ...data.posts,
                          posts: updatedPosts,
                        },
                      };
                    }
                  );
                }
              });

              console.log('Vote update function complete');
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
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === 'posts'
              );
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
