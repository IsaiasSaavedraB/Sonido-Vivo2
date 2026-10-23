import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartModal from './CartModal';

export default function Layout({ simple = false }) {
  return (
    <>
      <Header simple={simple} />
      <Outlet />
      <Footer />
      {!simple && <CartModal />}
    </>
  );
}
