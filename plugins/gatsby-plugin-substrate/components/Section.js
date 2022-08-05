import cx from 'classnames';
import React from 'react';

const Section = ({ children, children2, col = 1, mode, className }) => {
  const reversedOrder = mode === 'reversed';
  const sectionClass = 'container mb-20 lg:px-10';

  return (
    <>
      {col === 1 && <section className={cx(sectionClass, className)}>{children}</section>}
      {col === 2 && (
        <section className={cx(sectionClass, 'md:grid grid-cols-2 gap-8')}>
          <div className="mb-10 order-last">{children2}</div>
          <div className={cx('mb-12 md:mb-0', { 'order-last': reversedOrder })}>{children}</div>
        </section>
      )}
    </>
  );
};

export { Section };
