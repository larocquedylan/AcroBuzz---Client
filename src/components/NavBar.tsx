import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Mutation, useMutation, useQuery } from 'urql';
import { LogoutDocument, MeDocument } from '../codegen/graphql';
import { isServerSide } from '../utils/isServerSide';

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

export default function NavBar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [{ data, fetching }] = useQuery({
    query: MeDocument,
  });

  const [, logout] = useMutation(LogoutDocument);

  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    await logout({});
  };

  const username = data?.me?.username;

  let body = null;

  if (fetching) {
    body = <div>loading...</div>;
  } else if (!data.me) {
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
        <Flex h={20} alignItems={'center'} justifyContent={'space-between'}>
          <Box
            color={'orange'}
            fontSize='24px'
            fontWeight={'bold'}
            fontFamily={'roboto'}
          >
            Acro Buzz
          </Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
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
