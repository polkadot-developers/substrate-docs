import AOS from 'aos';
import cx from 'classnames';
import React, { useEffect } from 'react';

import Footer from '../site/Footer';
import Header from '../site/Header';
import ModalButton from '../site/Search/ModalButton';
import Banner from './Banner';

export default function LandingLayout({ layout = 'default', mode = 'default', header = 'default', children }) {
  useEffect(() => {
    AOS.init({
      disable: 'mobile',
      duration: 600,
    });
  }, []);

  return (
    <>
      <Banner />
      <Header mode={mode} header={header} />
      <main
        className={cx('min-h-screen', {
          'mt-12': layout === 'default',
        })}
      >
        {layout === 'default' && <>{children}</>}
      </main>
      <ModalButton />
      <Footer />
    </>
  );
}
