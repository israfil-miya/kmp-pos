'use client';

import React from 'react';
import Moment from 'react-moment';
import 'moment-timezone';

const Timecard: React.FC = () => {
  return (
    <div className="flex flex-col text-center">
      <div
        className="text-md text-white bg-gray-800 font-medium px-6 rounded-t-md"
        suppressHydrationWarning={true}
      >
        <Moment
          format="Do MMMM, YYYY"
          interval={1 * 60 * 60 * 1000} // changes every hour
          tz={'Asia/Dhaka'}
        />
      </div>
      <div
        className="text-md text-black font-semibold bg-gray-200 px-6 rounded-b-md"
        suppressHydrationWarning={true}
      >
        <Moment
          format="hh:mm:ss A"
          interval={1000} // changes every second
          tz={'Asia/Dhaka'}
        />
      </div>
    </div>
  );
};

export default Timecard;
