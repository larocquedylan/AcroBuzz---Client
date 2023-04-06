import React from 'react';
import { Box } from '@chakra-ui/react';

interface WrapperProps {
  children: React.ReactNode;
  // variant ? is optional
  variant?: 'small' | 'regular';
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = 'regular' }) => {
  return (
    <Box
      mt={32}
      mx='auto'
      maxW={variant === 'regular' ? '768px' : '350px'}
      w='100%'
    >
      {children}
    </Box>
  );
};

export default Wrapper;
