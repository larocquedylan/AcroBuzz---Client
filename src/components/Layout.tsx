import { ReactNode } from 'react';
import NavBar from '../components/NavBar';
import Wrapper, { WrapperVariant } from './Wrapper';

interface LayoutProps {
  variant?: WrapperVariant;
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};

export default Layout;
