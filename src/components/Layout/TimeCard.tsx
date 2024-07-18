'use client';

import React from 'react';
import Moment from 'react-moment';
import 'moment-timezone';

const Timecard: React.FC = () => {
  return (
    <div suppressHydrationWarning className="flex flex-col text-center">
      <Moment
        className="text-md text-white bg-blue-800 font-medium px-4 rounded-t-md"
        format="Do MMMM, YYYY"
        interval={1 * 60 * 60 * 1000} // changes every hour
        tz={'Asia/Dhaka'}
      />
      <Moment
        className="text-md text-white bg-indigo-600 font-medium px-4 rounded-b-md"
        format="hh:mm:ss A"
        interval={1000} // changes every second
        tz={'Asia/Dhaka'}
      />
    </div>
  );
};

export default Timecard;
