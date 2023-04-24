import { MoonIcon, PlusSquareIcon, SunIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { useLogoutMutation, useMeQuery } from '../codegen/graphql';
import { isServerSide } from '../utils/isServerSide';
import { useApolloClient } from '@apollo/client';

interface NavBarProps {
  pageProps: any;
}

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={'/'}
  >
    {children}
  </Link>
);

// export default function NavBar() {
function NavBar({ pageProps }: NavBarProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [result, setResult] = useState({ data: undefined, loading: true });

  const { data, loading, error } = useMeQuery({ skip: isServerSide });

  useEffect(() => {
    setResult({ data, loading });
  }, [data, loading]);

  const [logout, { loading: logoutFetching }] = useLogoutMutation();

  const apolloClient = useApolloClient();

  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    await logout();
    await apolloClient.resetStore();
  };

  const [username, setUsername] = useState<string | undefined>(undefined);

  useEffect(() => {
    setUsername(result.data?.me?.username);
  }, [result.data]);

  let body = null;

  if (result.loading) {
    body = <div>loading...</div>;
  } else if (!result.data?.me) {
    body = (
      <Link href='/login' style={{ textDecoration: 'none' }}>
        <Button
          variant='outline'
          colorScheme='orange'
          _hover={{
            transform: 'translateY(-5px)',
            boxShadow: 'lg',
          }}
        >
          Login / Register
        </Button>
      </Link>
    );
  } else {
    body = (
      <>
        <MenuButton
          as={Button}
          rounded={'full'}
          variant={'link'}
          cursor={'pointer'}
          minW={0}
        >
          <Avatar
            size={'sm'}
            src={'https://avatars.dicebear.com/api/male/username.svg'}
          />
        </MenuButton>
        <MenuList alignItems={'center'}>
          <br />
          <Center>
            <Avatar
              size={'2xl'}
              src={'https://avatars.dicebear.com/api/male/username.svg'}
            />
          </Center>
          <br />
          <Center>
            <p>{username}</p>
          </Center>
          <br />
          <MenuDivider />
          <MenuItem>Your Servers</MenuItem>
          <MenuItem>Account Settings</MenuItem>
          <MenuItem onClick={handleLogout}> Logout</MenuItem>
        </MenuList>
      </>
    );
  }

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex
          h={20}
          maxW={800}
          m='auto'
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Box
            color={'orange'}
            fontSize='24px'
            fontWeight={'bold'}
            fontFamily={'roboto'}
          >
            <NextLink href='/'>Acro Buzz</NextLink>
          </Box>
          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button
                as={NextLink}
                href='/create-post'
                _hover={{
                  transform: 'translateY(-5px)',
                  boxShadow: 'lg',
                }}
              >
                {<PlusSquareIcon />}
              </Button>
              <Button
                onClick={toggleColorMode}
                _hover={{
                  transform: 'translateY(-5px)',
                  boxShadow: 'lg',
                }}
              >
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
              <Menu>{body}</Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default NavBar;
// export default NavBar;
