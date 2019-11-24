import csv from 'csvtojson';
import { appendFileSync } from 'fs';

const csvFilePath = `${__dirname}/books.csv`;
const txtFilePath = `${__dirname}/books.txt`;

csv()
    .fromFile(csvFilePath)
    .then( data => writeFile(data));

function writeFile(books) {
    books.forEach( book => appendFileSync(txtFilePath, `${JSON.stringify(book)}\n`));
}
