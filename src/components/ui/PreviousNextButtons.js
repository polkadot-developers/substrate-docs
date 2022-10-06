import { Link } from 'gatsby';
import React from 'react';

export default function PreviousNextButtons({ previous, next }) {
  return (
    <div className="flex justify-between items-center">
      {previous ? (
        <Link to={previous} className="hover:opacity-100 opacity-80">
          &larr; Previous
        </Link>
      ) : (
        ''
      )}
      {next ? (
        <Link to={next} className="ml-auto hover:opacity-100 opacity-80">
          Next &rarr;
        </Link>
      ) : (
        ''
      )}
    </div>
  );
}
