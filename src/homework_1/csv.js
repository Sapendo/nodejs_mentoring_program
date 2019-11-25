import csv from 'csvtojson';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream';

const csvFilePath = `${__dirname}/books.csv`;
const txtFilePath = `${__dirname}/books.txt`;
const writeStream = createWriteStream(txtFilePath);
const readStream = createReadStream(csvFilePath);

pipeline(
    csv().fromStream(readStream),
    writeStream
)
