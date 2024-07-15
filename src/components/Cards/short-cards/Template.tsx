'use client';

import React from 'react';
import cn from '@/utility/cn';

interface Props {
  className?: string;
  title: string;
  description: string;
  onClick?: () => void;
  icon: React.ReactNode;
  iconClassName?: string;
}

const Template: React.FC<Props> = props => {
  return (
    <div
      className={cn(
        'p-4 flex-row flex flex-1 items-center gap-4 rounded-md',
        props.className,
      )}
    >
      <div
        className={cn(
          'text-4xl p-3 text-nowrap items-center flex rounded-md',
          props.iconClassName,
        )}
      >
        {props.icon}
      </div>
      <div className="flex flex-col justify-start gap-0">
        <h2 className="text-xl font-bold">{props.title}</h2>
        <p className="text-gray-700">{props.description}</p>
      </div>
    </div>
  );
};

export default Template;
