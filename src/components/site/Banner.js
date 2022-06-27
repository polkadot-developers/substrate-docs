import cx from 'classnames';
import React, { Fragment } from 'react';

import { useBanner } from '../../hooks/use-banner';
import { useSessionStorage } from '../../hooks/use-session-storage';
import Icon from '../default/Icon';

const Banner = () => {
  const [isBannerOpen, setIsBannerOpen] = useSessionStorage('banner', true);
  const { banners } = useBanner();
  const hasActiveBanner = banners.length > 0;

  const handleKeypress = e => {
    if (e.key === 'Enter') {
      setIsBannerOpen(false);
    }
  };

  return (
    <>
      {hasActiveBanner && isBannerOpen && (
        <div
          className={cx(
            'hidden md:block fixed z-50 right-10 bottom-8 max-w-sm p-6 transition-all text-white dark:text-black dark:bg-substrateGray bg-substrateBlackish m-0 shadow-xxl rounded-md'
          )}
        >
          {banners.map(
            (
              {
                node: {
                  html,
                  frontmatter: { title },
                },
              },
              idx
            ) => (
              <Fragment key={idx}>
                {idx > 0 && <hr className="mt-3 mb-2 border-substrateDarkThemeGrey dark:border-substrateSubtleGrey" />}
                <div className="banner">
                  <span className="block pr-2 mb-2 font-bold text-xl">{title}</span>
                  <div
                    dangerouslySetInnerHTML={{ __html: html }}
                    className="underline-animate underline-animate-thin"
                  ></div>
                </div>
              </Fragment>
            )
          )}

          <div
            className="absolute right-4 top-4 cursor-pointer duration-150 ease-in-out hover:scale-110"
            tabIndex="0"
            onClick={() => setIsBannerOpen(false)}
            onKeyPress={handleKeypress}
          >
            <Icon name="close-x" className="fill-current h-4 w-4" />
          </div>
        </div>
      )}
    </>
  );
};

export default Banner;
