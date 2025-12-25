const fs = require('fs');
const path = require('path');

const width = 16;
const height = 16;
const reserved = 0;
const type = 1;
const count = 1;
const planes = 1;
const bitCount = 32;
const bytesPerPixel = 4;

const header = Buffer.alloc(6);
header.writeUInt16LE(reserved, 0);
header.writeUInt16LE(type, 2);
header.writeUInt16LE(count, 4);

const maskRowSize = Math.ceil(width / 32) * 4;
const maskSize = maskRowSize * height;
const xorSize = width * height * bytesPerPixel;
const dibSize = 40;
const imageSize = dibSize + xorSize + maskSize;

const entry = Buffer.alloc(16);
entry.writeUInt8(width, 0);
entry.writeUInt8(height, 1);
entry.writeUInt8(0, 2);
entry.writeUInt8(0, 3);
entry.writeUInt16LE(planes, 4);
entry.writeUInt16LE(bitCount, 6);
entry.writeUInt32LE(imageSize, 8);
entry.writeUInt32LE(header.length + entry.length, 12);

const dib = Buffer.alloc(dibSize);
dib.writeUInt32LE(dibSize, 0);
dib.writeInt32LE(width, 4);
dib.writeInt32LE(height * 2, 8);
dib.writeUInt16LE(planes, 12);
dib.writeUInt16LE(bitCount, 14);
dib.writeUInt32LE(0, 16);
dib.writeUInt32LE(xorSize, 20);
dib.writeInt32LE(0, 24);
dib.writeInt32LE(0, 28);
dib.writeUInt32LE(0, 32);
dib.writeUInt32LE(0, 36);

const xor = Buffer.alloc(xorSize);
const color = { b: 0xff, g: 0x5f, r: 0x6b, a: 0xff };
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * bytesPerPixel;
    xor[idx] = color.b;
    xor[idx + 1] = color.g;
    xor[idx + 2] = color.r;
    xor[idx + 3] = color.a;
  }
}

const mask = Buffer.alloc(maskSize, 0x00);

const icoBuffer = Buffer.concat([header, entry, dib, xor, mask]);
const outputPath = path.join(__dirname, '..', 'app', 'favicon.ico');
fs.writeFileSync(outputPath, icoBuffer);
console.log(`Generated favicon at ${outputPath}`);
