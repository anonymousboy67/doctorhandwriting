// src/utils/ocr.js
import Tesseract from 'tesseract.js';

export const extractText = (image) => {
  return Tesseract.recognize(
    image,
    'eng',
    {
      logger: (info) => console.log(info),
    }
  ).then(({ data: { text } }) => text);
};