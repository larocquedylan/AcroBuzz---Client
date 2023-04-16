import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React from 'react';
import { GetPaginatedPostsQuery } from '../codegen/graphql';

interface VoteSectionProps {
  post: GetPaginatedPostsQuery['posts']['posts'][0];
}

const VoteSection: React.FC<VoteSectionProps> = ({ post }) => {
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
        onClick={() => console.log('yo')}
      />
      {post.totalPoints}
      <IconButton
        colorScheme='red'
        aria-label='Down Vote Post'
        size='md'
        icon={<ChevronDownIcon />}
        onClick={() => console.log('no')}
      />
    </Flex>
  );
};

export default VoteSection;
