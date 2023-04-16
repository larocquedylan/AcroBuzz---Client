import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React from 'react';
import { GetPaginatedPostsQuery, VoteDocument } from '../codegen/graphql';
import { useMutation } from 'urql';

interface VoteSectionProps {
  post: GetPaginatedPostsQuery['posts']['posts'][0];
}

const VoteSection: React.FC<VoteSectionProps> = ({ post }) => {
  const [, vote] = useMutation(VoteDocument);

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
        onClick={() => {
          vote({
            postId: post.id,
            voteValue: 1,
          });
        }}
      />
      {post.totalPoints}
      <IconButton
        colorScheme='red'
        aria-label='Down Vote Post'
        size='md'
        icon={<ChevronDownIcon />}
        onClick={() => {
          vote({
            postId: post.id,
            voteValue: -1,
          });
        }}
      />
    </Flex>
  );
};

export default VoteSection;
