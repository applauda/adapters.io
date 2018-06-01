const intToHexString = (number: number) => {
  const c = Number(number);
  const rgbDec = [(c & 0xff0000) >> 16, (c & 0x00ff00) >> 8, (c & 0x0000ff)];
  return `#${rgbDec.map((d) => {
    const hex = d.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }).join('')}`;
};

const colors = {
  intToHexString,
};

export {
  colors,
};
