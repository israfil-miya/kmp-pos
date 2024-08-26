'use client';

import 'moment-timezone';
import React from 'react';
import Moment from 'react-moment';

const Timecard: React.FC = () => {
  return (
    <div className="flex flex-col text-center border-1 border rounded-md overflow-hidden">
      <div
        className="text-md text-black font-semibold bg-gray-300 px-6"
        suppressHydrationWarning={true}
      >
        <Moment
          format="Do MMMM, YYYY"
          interval={1 * 60 * 60 * 1000} // changes every hour
          tz={'Asia/Dhaka'}
        />
      </div>
      <div
        className="text-md text-black bg-white px-6"
        suppressHydrationWarning={true}
      >
        <Moment
          // format="hh:mm:ss A"
          format="hh:mm A"
          interval={1000} // changes every second
          tz={'Asia/Dhaka'}
        />
      </div>
    </div>
  );
};

export default Timecard;
