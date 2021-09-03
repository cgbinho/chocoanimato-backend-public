// RGBA TO HEX WITH ALPHA
export async function rgbaToHexA(rgba: string): Promise<string> {
  const colorArray = rgba.split(',');

  const color = colorArray.map(color => parseInt(color));

  let r = color[0].toString(16);
  let g = color[1].toString(16);
  let b = color[2].toString(16);
  let a = Math.round(color[3] * 255).toString(16);

  if (r.length === 1) r = '0' + r;
  if (g.length === 1) g = '0' + g;
  if (b.length === 1) b = '0' + b;
  if (a.length === 1) a = '0' + a;

  return '#' + r + g + b + a;
}

// RGB TO HEX
export async function rgbToHex(rgb: string): Promise<string> {
  const colorArray = rgb.split(',');

  const color = colorArray.map(color => parseInt(color));

  let r = color[0].toString(16);
  let g = color[1].toString(16);
  let b = color[2].toString(16);

  if (r.length === 1) r = '0' + r;
  if (g.length === 1) g = '0' + g;
  if (b.length === 1) b = '0' + b;

  return '#' + r + g + b;
}

// export default rgbaToHexA;
