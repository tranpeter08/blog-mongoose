const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = express.Router();
const mongoose = require("mongoose");
const {DATABASE_URL, PORT} = require("./config");

mongoose.Promise = global.Promise;

const blogPostRouter = require('./blogPostRouter')

const app = express();
app.use(express.json());

app.use(morgan('common'));

app.use('/posts',blogPostRouter);

let server;

function runServer(dataURL, port = PORT){
  return new Promise((resolve, reject)=>{
    mongoose.connect(
      dataURL, 
      err=>{
        if(err){
          return reject(err);
        }
        server = app  
          .listen(port, ()=>{
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on("error", err=>{
            mongoose.disconnect();
            reject(err);
          });

      
      });
    
  })
}

function closeServer(){
  return mongoose.disconnect().then(()=>{
    return new Promise((resolve, reject)=>{
      console.log("Closing Server");
      server.close(err =>{
        if(err){
          return reject(err);
        }
        resolve();
      });
    });
  });
}
/*
function runServer(){
  const port = process.env.PORT || 8080;
  return new Promise(function(resolve, reject){
    server = app
      .listen(port, function(){
        console.log(`Your app is listening on port ${port}`);
        resolve(server);
      })
      .on("error", err => {
        reject(err);
      });
  });
};

function closeServer(){
  return new Promise((resolve, reject)=>{
    console.log("Closing the server");
    server.close(err =>{
      if (err){
        reject(err);
        return;
      }
      resolve();
    });
  });
}
*/
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };