import csv from 'csvtojson';
import { writeFileSync, appendFileSync } from 'fs';

const csvFilePath = `${__dirname}/books.csv`;
const txtFilePath = `${__dirname}/books.txt`;

csv()
    .fromFile(csvFilePath)
    .then( data => writeFile(data));

function writeFile(books) {
    books.forEach( (book, index) => {
        if(index === 0) {
            writeFileSync(txtFilePath, `${JSON.stringify(book)}\n`)
        } else {
            appendFileSync(txtFilePath, `${JSON.stringify(book)}\n`);
        }
    });
}
