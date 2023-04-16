import { ReactNode } from 'react';
import NavBar from '../components/NavBar';
import Wrapper, { WrapperVariant } from './Wrapper';

interface LayoutProps {
  variant?: WrapperVariant;
  children: ReactNode;
  pageProps?: any;
}

const Layout: React.FC<LayoutProps> = ({ children, variant, pageProps }) => {
  return (
    <>
      <NavBar pageProps={pageProps} />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};

export default Layout;
