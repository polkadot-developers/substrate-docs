import React from 'react';

import analytics from '../../../analytics';
import snakecase from '../../../hooks/snakecase';
import { Link } from '../../default/Link';

export default function CardLink({ link, children }) {
  return (
    <Link
      className="CardLink font-bold mdx-anchor text-substrateDark dark:text-white block my-2 group"
      to={link}
      onClick={() => {
        analytics.click(snakecase(link));
      }}
    >
      <span>{children}</span>
      <svg
        className="inline ml-1 group-hover:ml-2 duration-300 fill-current"
        width="11"
        height="9"
        viewBox="0 0 11 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.68537 2.68874C6.51839 2.49996 6.42599 2.24712 6.42808 1.98467C6.43017 1.72223 6.52657 1.47118 6.69653 1.28559C6.86649 1.10001 7.09641 0.99474 7.33676 0.99246C7.57711 0.990179 7.80867 1.09107 7.98156 1.2734L10.7316 4.27624C10.9035 4.46395 11 4.71849 11 4.98391C11 5.24932 10.9035 5.50387 10.7316 5.69158L7.98156 8.69442C7.897 8.79002 7.79585 8.86628 7.68401 8.91873C7.57217 8.97119 7.45188 8.99881 7.33016 8.99996C7.20845 9.00112 7.08774 8.97579 6.97508 8.92546C6.86243 8.87513 6.76008 8.80081 6.67401 8.70683C6.58794 8.61285 6.51987 8.50109 6.47378 8.37808C6.42769 8.25506 6.40449 8.12326 6.40555 7.99035C6.40661 7.85745 6.4319 7.7261 6.47994 7.60399C6.52798 7.48187 6.59782 7.37142 6.68537 7.27908L7.87064 5.98486L0.916682 5.98486C0.673563 5.98486 0.440401 5.8794 0.26849 5.69169C0.0965786 5.50397 -5.73807e-07 5.24938 -6.14421e-07 4.98391C-6.55035e-07 4.71844 0.0965785 4.46385 0.26849 4.27613C0.440401 4.08842 0.673563 3.98296 0.916682 3.98296L7.87064 3.98296L6.68537 2.68874Z"
        />
      </svg>
    </Link>
  );
}
