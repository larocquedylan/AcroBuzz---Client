import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React from 'react';
import {
  GetPaginatedPostsQuery,
  VoteDocument,
  VoteMutationVariables,
} from '../codegen/graphql';
import { useMutation } from 'urql';

interface VoteSectionProps {
  post: GetPaginatedPostsQuery['posts']['posts'][0];
}

const VoteSection: React.FC<VoteSectionProps> = ({ post }) => {
  const [, vote] = useMutation(VoteDocument);
  const [loadingState, setLoadingState] = React.useState<
    'upvote-loading' | 'downvote-loading' | 'not-loading'
  >('not-loading');

  return (
    <Flex
      direction='column'
      justifyContent='center'
      alignItems='center'
      paddingRight={8}
    >
      <IconButton
        colorScheme='orange'
        aria-label='Up Vote Post'
        size='md'
        icon={<ChevronUpIcon />}
        onClick={async () => {
          setLoadingState('upvote-loading');
          await vote({
            postId: post.id,
            voteValue: 1,
          });
          setLoadingState('not-loading');
        }}
        isLoading={loadingState === 'upvote-loading'}
      />
      {post.totalPoints}
      <IconButton
        colorScheme='red'
        aria-label='Down Vote Post'
        size='md'
        icon={<ChevronDownIcon />}
        onClick={async () => {
          setLoadingState('downvote-loading');
          await vote({
            postId: post.id,
            voteValue: -1,
          });
          setLoadingState('not-loading');
        }}
        isLoading={loadingState === 'downvote-loading'}
      />
    </Flex>
  );
};

export default VoteSection;
