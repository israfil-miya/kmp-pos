'use client';

import bwipjs from 'bwip-js/browser';
import { jsPDF } from 'jspdf';
import { useState } from 'react';
import { toast } from 'sonner';
import 'svg2pdf.js';

interface BarcodeProps {
  code: string;
}

const Barcode: React.FC<BarcodeProps> = ({ code }) => {
  const [loading, setLoading] = useState(false);
  const handleBarcodeDownload = (
    code: string,
    file_name: string = `${code}_${Date.now()}_barcode.pdf`,
  ) => {
    setLoading(true);
    try {
      let svg = bwipjs.toSVG({
        bcid: 'code128',
        text: code,
        includetext: true,
        textxalign: 'center',
        textcolor: '000000',
      });

      const parser = new DOMParser();
      let svgDoc = parser.parseFromString(svg, 'text/html');
      const element = svgDoc.body.firstChild;

      const doc = new jsPDF();

      doc.svg(element as Element).then(() => {
        doc.save(file_name);
      });
    } catch (error) {
      toast.error('Failed to download barcode');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={() => handleBarcodeDownload(code)}
      className="items-center gap-2 rounded-sm bg-yellow-600 hover:opacity-90 hover:ring-2 hover:ring-yellow-600 transition duration-200 delay-300 hover:text-opacity-100 text-white p-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5M3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0z" />
      </svg>
    </button>
  );
};

export default Barcode;
