import cx from 'classnames';
import { Link } from 'gatsby';
import React, { useEffect, useState } from 'react';

import { WEBSITE_URL } from '../../../config/webConsts';
import useScrollListener from '../../hooks/use-scroll-listener';
import Icon from '../default/Icon';
import Logo from '../site/Logo';
import DocsButton from './DocsButton';
import NavMain from './NavMain';
import NavMobile from './NavMobile';
//import SearchForm from './SearchForm';
import ModalButton from './Search/ModalButton';
import ThemeToggle from './ThemeToggle';

const Header = ({ mode, header }) => {
  const scroll = useScrollListener();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  useEffect(() => {
    /* TODO: add into context */
    if (scroll.y > 30) {
      setIsScrolled(true);
    } else if (scroll.y < 1) {
      setIsScrolled(false);
    }
  }, [scroll.y]);

  return (
    <header
      className={cx('sticky top-0 z-50 border-b border-gray-200 dark:border-substrateDarkThemeGrey', {
        'border-transparent dark:border-transparent': mode === 'full' && !isScrolled,
        'bg-transparent transition-colors': header === 'home' && !isScrolled,
        'bg-white dark:bg-substrateDarkest': header === 'default' || (header === 'home' && isScrolled),
        'duration-75': header === 'home' && !isScrolled,
        'duration-200': header === 'home' && isScrolled,
      })}
    >
      <div className="px-4 xl:px-12">
        <div
          className={cx('flex items-center justify-between transition-height ease-in-out', {
            'h-24': !isScrolled,
            'h-16': isScrolled,
          })}
        >
          <div className="w-40 relative transform transition-all duration-300 ease-in-out hover:opacity-50">
            <Link to={WEBSITE_URL} alt="Substrate home" name="Substrate home">
              <Logo />
            </Link>
          </div>
          <div className="lg:hidden cursor-pointer" onClick={toggleMenu}>
            <Icon name="hamburger-toggle" />
          </div>
          {isMobileNavOpen && <NavMobile toggleMenu={toggleMenu} />}
          <div className="hidden lg:flex lg:justify-between lg:items-center w-full">
            <div className="w-2/3 max-w-3xl">
              <NavMain header={header} isScrolled={isScrolled} />
            </div>
            <div className=" w-1/2 flex items-center justify-end">
              <div>
                <ModalButton />
              </div>
              <div className="pl-8 pr-6">
                <DocsButton />
              </div>
              <div className="w-6 h-6">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
