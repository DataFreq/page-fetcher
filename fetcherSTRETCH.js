const request = require('request');
const fs = require('fs');
const readline = require('readline');
const regex = /http(s):\/\/www\./i;

const url = process.argv.slice(2).filter(input => input.match(regex)).toString();
const localPath = process.argv.slice(2).filter(input => !input.match(regex)).toString();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const writeToDisk = (content, path) => {
  fs.writeFile(path, content, err => {
    if (err) {
      console.log(err);
      process.exit();
    }
    print(path);
  });
};

const print = (path) => {
  fs.stat(path, (err, stats) => {
    if (err) {
      console.log(err);
      process.exit();
    }
    rl.close();
    console.log(`Downloaded and saved ${stats.size} bytes to ${path}`);
  });
};

const fileCheck = (urlCheck, path)=> {
  let dir = path.match(/^(.*[\\/])/).pop().toString();
  fs.access(dir, (err) => {
    if (!err) {
      fs.access(path, (err) => {
        if (!err) {
          rl.question('File already exists. Do you want to overwrite? (y/n) ', answer => {
            if (answer.includes('y') || answer.includes('Y')) {
              fetchData(urlCheck, path);
              return;
            }
            console.log('Terminating.');
            process.exit();
          });
        } else fetchData(urlCheck, path);
      });
    } else if (err.code === 'ENOENT') {
      console.log('Directory not found. Terminating.');
      process.exit();
    }
  });
};

const fetchData = (urlCheck, path) => {
  request(urlCheck, (error, response, content) => {
    if (error) {
      console.log('URL is invalid. Terminating.');
      process.exit();
    }
    writeToDisk(content, path);
  });
};

fileCheck(url, localPath);