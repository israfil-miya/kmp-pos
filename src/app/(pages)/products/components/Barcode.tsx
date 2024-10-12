'use client';

import bwipjs from 'bwip-js/browser';
import { jsPDF } from 'jspdf';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'sonner';
import 'svg2pdf.js';
import { ProductDataTypes } from '../schema';

interface BarcodeProps {
  productData: ProductDataTypes;
}

export const handleBarcodeDownload = (
  code: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  product_name: string | undefined = undefined,
  price: number | undefined = undefined,
  vat_rate: number = 0,
  file_name: string = `${code}_${Date.now()}_barcode.pdf`,
  store_name: string = 'Khalek Molla Plaza',
) => {
  setLoading(true);
  try {
    let svg = bwipjs.toSVG({
      bcid: 'code128',
      text: code,
      includetext: true,
      textxalign: 'center',
      textcolor: '000000',
      paddingwidth: 10,
      paddingheight: 10,
      scale: 3, // 3x scaling factor
      height: 10,
      backgroundcolor: 'ffffff',
    });

    const parser = new DOMParser();
    let svgDoc = parser.parseFromString(svg, 'text/html');
    const element = svgDoc.body.firstChild;

    const doc = new jsPDF();

    if (product_name) {
      doc.setFontSize(16);

      doc.setFont('courier', 'normal');

      // Manually split the product name by spaces
      const words = product_name.split(' ');

      // Variable to hold each line (group of words)
      let lines = [];
      let currentLine = words[0];

      // Max width for text (adjust as necessary)
      const maxWidth = 180;

      words.slice(1).forEach(word => {
        const testLine = `${currentLine} ${word}`;
        const testWidth = doc.getTextWidth(testLine);

        if (testWidth < maxWidth) {
          currentLine = testLine; // Add the word to the current line
        } else {
          lines.push(currentLine); // Push the current line to the lines array
          currentLine = word; // Start a new line with the current word
        }
      });

      lines.push(currentLine); // Push the last line

      // Starting Y position for the text
      let yPosition = 25;

      // Center and render each line of text
      lines.forEach(line => {
        doc.text(line, 105, yPosition, { align: 'center' });
        yPosition += 8; // Move to the next line (adjust spacing as needed)
      });
    }

    // Add the barcode SVG after the text
    doc
      .svg(element as Element, {
        y: 25,
      })
      .then(() => {
        // Add the price below the barcode
        if (price !== undefined) {
          doc.setFont('courier', 'bold'); // 'courier' is a monospace font, and 'bold' makes it bold
          doc.setFontSize(18);
          doc.text(
            `SELL PRICE: ${Number(
              Math.round(
                parseFloat(price + (price * vat_rate) / 100 + 'e' + 2),
              ) +
                'e-' +
                2,
            ).toFixed(2)} BDT (VAT Included)`,
            105,
            100,
            {
              align: 'center',
            },
          );
        }
        if (store_name) {
          doc.setFontSize(24);

          // Increase letter spacing (e.g., 1pt space between characters)
          doc.setCharSpace(3);

          // Set font family to monospace (Courier is built-in)
          doc.setFont('courier', 'normal');

          // Render the store name with uppercase letters, center-aligned
          doc.text(store_name.toUpperCase(), 80, 115, {
            align: 'center',
          });
        }
        // Save the PDF
        doc.save(file_name);
      });
  } catch (error) {
    toast.error('Failed to download barcode');
  } finally {
    setLoading(false);
  }
};

const Barcode: React.FC<BarcodeProps> = ({ productData }) => {
  const [loading, setLoading] = useState(false);

  return (
    <button
      disabled={loading}
      onClick={() =>
        handleBarcodeDownload(
          productData.batch,
          setLoading,
          productData.name,
          productData.selling_price,
          productData.vat_rate,
        )
      }
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
