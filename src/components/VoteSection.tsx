import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import {
  GetPaginatedPostsDocument,
  GetPaginatedPostsQuery,
  useVoteMutation,
} from '../codegen/graphql';

interface VoteSectionProps {
  post: GetPaginatedPostsQuery['posts']['posts'][0];
}

const VoteSection: React.FC<VoteSectionProps> = ({ post }) => {
  const [userVote, setUserVote] = useState(0);
  const [vote, { data, loading, error }] = useVoteMutation({
    refetchQueries: [
      {
        query: GetPaginatedPostsDocument,
        variables: {
          postId: post.id,
        },
      },
    ],
  });

  const handleVote = async (voteValue: number) => {
    if (loading) return;

    if (
      (voteValue === 1 && userVote < 2) ||
      (voteValue === -1 && userVote > -2)
    ) {
      await vote({
        variables: {
          postId: post.id,
          voteValue,
        },
      });
      setUserVote(userVote + voteValue);
    }
  };

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
        onClick={async () => handleVote(1)}
        isDisabled={userVote === 2}
      />
      {post.totalPoints}
      <IconButton
        colorScheme='red'
        aria-label='Down Vote Post'
        size='md'
        icon={<ChevronDownIcon />}
        onClick={async () => handleVote(-1)}
        isDisabled={userVote === -2}
      />
    </Flex>
  );
};

export default VoteSection;
