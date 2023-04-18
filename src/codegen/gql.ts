/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "fragment RegularUser on UserType {\n  id\n  username\n  createdAt\n}": types.RegularUserFragmentDoc,
    "mutation CreatePost($title: String!, $text: String!) {\n  createPost(title: $title, text: $text) {\n    id\n    title\n    text\n    createdAt\n    updatedAt\n    author {\n      id\n      username\n    }\n    votes {\n      id\n      voteValue\n    }\n  }\n}": types.CreatePostDocument,
    "mutation DeletePost($deletePostId: Int!) {\n  deletePost(id: $deletePostId)\n}": types.DeletePostDocument,
    "mutation Login($username: String!, $password: String!) {\n  login(options: {username: $username, password: $password}) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}": types.LoginDocument,
    "mutation Logout {\n  logout\n}": types.LogoutDocument,
    "mutation Register($username: String!, $password: String!) {\n  register(options: {username: $username, password: $password}) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}": types.RegisterDocument,
    "mutation UpdatePost($id: Int!, $title: String!, $text: String!) {\n  updatePost(id: $id, title: $title, text: $text) {\n    id\n    updatedAt\n    createdAt\n    title\n    text\n    textSnippet\n  }\n}": types.UpdatePostDocument,
    "mutation Vote($voteValue: Int!, $postId: Int!) {\n  vote(voteValue: $voteValue, postId: $postId) {\n    id\n    voteValue\n    postId\n    post {\n      id\n    }\n    userId\n    user {\n      id\n      username\n    }\n  }\n}": types.VoteDocument,
    "query Me {\n  me {\n    ...RegularUser\n  }\n}": types.MeDocument,
    "query Post($id: Int!) {\n  post(id: $id) {\n    id\n    createdAt\n    updatedAt\n    title\n    text\n    totalPoints\n    author {\n      id\n      username\n    }\n  }\n}": types.PostDocument,
    "query GetPaginatedPosts($cursor: String, $limit: Int) {\n  posts(input: {cursor: $cursor, limit: $limit}) {\n    posts {\n      id\n      __typename\n      createdAt\n      updatedAt\n      title\n      textSnippet\n      text\n      totalPoints\n      author {\n        id\n        username\n      }\n    }\n    nextCursor\n  }\n}": types.GetPaginatedPostsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment RegularUser on UserType {\n  id\n  username\n  createdAt\n}"): (typeof documents)["fragment RegularUser on UserType {\n  id\n  username\n  createdAt\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreatePost($title: String!, $text: String!) {\n  createPost(title: $title, text: $text) {\n    id\n    title\n    text\n    createdAt\n    updatedAt\n    author {\n      id\n      username\n    }\n    votes {\n      id\n      voteValue\n    }\n  }\n}"): (typeof documents)["mutation CreatePost($title: String!, $text: String!) {\n  createPost(title: $title, text: $text) {\n    id\n    title\n    text\n    createdAt\n    updatedAt\n    author {\n      id\n      username\n    }\n    votes {\n      id\n      voteValue\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeletePost($deletePostId: Int!) {\n  deletePost(id: $deletePostId)\n}"): (typeof documents)["mutation DeletePost($deletePostId: Int!) {\n  deletePost(id: $deletePostId)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($username: String!, $password: String!) {\n  login(options: {username: $username, password: $password}) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}"): (typeof documents)["mutation Login($username: String!, $password: String!) {\n  login(options: {username: $username, password: $password}) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Logout {\n  logout\n}"): (typeof documents)["mutation Logout {\n  logout\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Register($username: String!, $password: String!) {\n  register(options: {username: $username, password: $password}) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}"): (typeof documents)["mutation Register($username: String!, $password: String!) {\n  register(options: {username: $username, password: $password}) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...RegularUser\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdatePost($id: Int!, $title: String!, $text: String!) {\n  updatePost(id: $id, title: $title, text: $text) {\n    id\n    updatedAt\n    createdAt\n    title\n    text\n    textSnippet\n  }\n}"): (typeof documents)["mutation UpdatePost($id: Int!, $title: String!, $text: String!) {\n  updatePost(id: $id, title: $title, text: $text) {\n    id\n    updatedAt\n    createdAt\n    title\n    text\n    textSnippet\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Vote($voteValue: Int!, $postId: Int!) {\n  vote(voteValue: $voteValue, postId: $postId) {\n    id\n    voteValue\n    postId\n    post {\n      id\n    }\n    userId\n    user {\n      id\n      username\n    }\n  }\n}"): (typeof documents)["mutation Vote($voteValue: Int!, $postId: Int!) {\n  vote(voteValue: $voteValue, postId: $postId) {\n    id\n    voteValue\n    postId\n    post {\n      id\n    }\n    userId\n    user {\n      id\n      username\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Me {\n  me {\n    ...RegularUser\n  }\n}"): (typeof documents)["query Me {\n  me {\n    ...RegularUser\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Post($id: Int!) {\n  post(id: $id) {\n    id\n    createdAt\n    updatedAt\n    title\n    text\n    totalPoints\n    author {\n      id\n      username\n    }\n  }\n}"): (typeof documents)["query Post($id: Int!) {\n  post(id: $id) {\n    id\n    createdAt\n    updatedAt\n    title\n    text\n    totalPoints\n    author {\n      id\n      username\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetPaginatedPosts($cursor: String, $limit: Int) {\n  posts(input: {cursor: $cursor, limit: $limit}) {\n    posts {\n      id\n      __typename\n      createdAt\n      updatedAt\n      title\n      textSnippet\n      text\n      totalPoints\n      author {\n        id\n        username\n      }\n    }\n    nextCursor\n  }\n}"): (typeof documents)["query GetPaginatedPosts($cursor: String, $limit: Int) {\n  posts(input: {cursor: $cursor, limit: $limit}) {\n    posts {\n      id\n      __typename\n      createdAt\n      updatedAt\n      title\n      textSnippet\n      text\n      totalPoints\n      author {\n        id\n        username\n      }\n    }\n    nextCursor\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;