'use client';

import React from 'react';
import LongCardTemplate from '@/components/Cards/long-cards/Template';
import { useRouter } from 'next/navigation';

const LongCards = () => {
  const router = useRouter();
  return (
    <div className="grid grid-cols-3 gap-4">
      <LongCardTemplate
        title="Expired"
        description="0"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="w-8 h-8 fill-red-500"
            viewBox="0 0 16 16"
          >
            <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z" />
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
          </svg>
        }
        className="bg-white border"
      />
      <LongCardTemplate
        title="Today Invoice"
        description="0"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="w-8 h-8 fill-yellow-500"
            viewBox="0 0 16 16"
          >
            <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5M11.5 4a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z" />
            <path d="M2.354.646a.5.5 0 0 0-.801.13l-.5 1A.5.5 0 0 0 1 2v13H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H15V2a.5.5 0 0 0-.053-.224l-.5-1a.5.5 0 0 0-.8-.13L13 1.293l-.646-.647a.5.5 0 0 0-.708 0L11 1.293l-.646-.647a.5.5 0 0 0-.708 0L9 1.293 8.354.646a.5.5 0 0 0-.708 0L7 1.293 6.354.646a.5.5 0 0 0-.708 0L5 1.293 4.354.646a.5.5 0 0 0-.708 0L3 1.293zm-.217 1.198.51.51a.5.5 0 0 0 .707 0L4 1.707l.646.647a.5.5 0 0 0 .708 0L6 1.707l.646.647a.5.5 0 0 0 .708 0L8 1.707l.646.647a.5.5 0 0 0 .708 0L10 1.707l.646.647a.5.5 0 0 0 .708 0L12 1.707l.646.647a.5.5 0 0 0 .708 0l.509-.51.137.274V15H2V2.118z" />
          </svg>
        }
        className="bg-white border"
      />
      <LongCardTemplate
        title="New Products"
        description="0"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="w-8 h-8 fill-blue-500"
            viewBox="0 0 16 16"
          >
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
          </svg>
        }
        className="bg-white border"
      />
      <LongCardTemplate
        title="Card 4"
        description="0"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="w-8 h-8 fill-green-500"
            viewBox="0 0 16 16"
          >
            <path d="M4.5 0A.5.5 0 0 1 5 .5V2h6V.5a.5.5 0 0 1 1 0V2h.5a.5.5 0 0 1 0 1H15a.5.5 0 0 1 0-1H14V.5A.5.5 0 0 1 14.5 0H15v.5a.5.5 0 0 1-1 0V.5H2V.5a.5.5 0 0 1-1 0V0H.5a.5.5 0 0 1 0 1H1v1.5a.5.5 0 0 1 .5.5h13a.5.5 0 0 1 .5-.5V1h.5a.5.5 0 0 1 0-1H15z" />
          </svg>
        }
        className="bg-white border"
      />
      <LongCardTemplate
        title="Card 5"
        description="0"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="w-8 h-8 fill-purple-500"
            viewBox="0 0 16 16"
          >
            <path d="M8 0C3.581 0 0 3.581 0 8s3.581 8 8 8 8-3.581 8-8S12.419 0 8 0zm0 1c3.867 0 7 3.133 7 7s-3.133 7-7 7-7-3.133-7-7 3.133-7 7-7zM6.5 5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h1zm4 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h1z" />
          </svg>
        }
        className="bg-white border"
      />
      <LongCardTemplate
        title="Card 6"
        description="0"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="w-8 h-8 fill-purple-500"
            viewBox="0 0 16 16"
          >
            <path d="M8 0C3.581 0 0 3.581 0 8s3.581 8 8 8 8-3.581 8-8S12.419 0 8 0zm0 1c3.867 0 7 3.133 7 7s-3.133 7-7 7-7-3.133-7-7 3.133-7 7-7zM6.5 5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h1zm4 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h1z" />
          </svg>
        }
        className="bg-white border"
      />
    </div>
  );
};

export default LongCards;
