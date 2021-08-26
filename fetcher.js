const request = require('request');
const fs = require('fs');
const regex = /http(s):\/\/www\./i;

const url = process.argv.slice(2).filter(input => input.match(regex)).toString();
const localPath = process.argv.slice(2).filter(input => !input.match(regex)).toString();

const print = (path) => {
  fs.stat(path, (err, stats) => {
    if (err) {
      console.log(err);
    }
    console.log(`Downloaded and saved ${stats.size} bytes to ${path}`);
  });
};

const writeToDisk = (content, path) => {
  fs.writeFile(path, content, (err)=> {
    if (err) {
      console.log(err);
    }
    print(path);
  });
};

const fetchData = (fetchURL, path) => {
  request(fetchURL, (error, res, body) => {
    if (error) {
      console.log(error);
    }
    writeToDisk(body, path);
  });
};

fetchData(url, localPath);