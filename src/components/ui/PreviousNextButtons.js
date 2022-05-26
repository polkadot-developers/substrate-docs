import React from 'react';

import PrimaryFixedButton from './PrimaryFixedButton';
import SecondaryButton from './SecondaryButton';

export default function PreviousNextButtons({ previous, next }) {
  return (
    <div className="flex justify-between items-center">
      <SecondaryButton link={previous}>Previous</SecondaryButton>
      <PrimaryFixedButton link={next}>Next</PrimaryFixedButton>
    </div>
  );
}
