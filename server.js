const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

var Schema = mongoose.Schema;

//mongoose.connect('mongodb://localhost/mydb');
/*mongoose.connect('mongodb://localhost/test', {
  useNewUrlParser: true
});
*/
//Define Schema
var testSchema = new Schema({
  username: String,
  description: String,
  duration: String,
  date: String
});

const myModel = mongoose.model('user', testSchema);

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user', (req, res) => {
    //console.log(req.body);
    let user = new myModel({
      username: req.body.username
    });
    var myresult = {};
    var myjson = {};
    //{"username":"Silindo1","_id":"SJL0DmhJ8"}
    
    user.save(function (err, doc) {
      if (err) return console.error(err);
      console.log(doc.original_url + " =>  saved to collection");
        myModel.find({username: req.body.username}).then((doc2)=> {
          console.log('Haa ' + doc2.username);
        //   myjson = JSON.parse(doc2);
          
          myresult.username = doc2.username;
          myresult._id = doc2._id;

         // console.log(myresult);

          res.send(myresult);
        });
      //    res.send(myData);
      });

  //res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/add', (req, res) => {
  console.log(req.body);
  let myresults = {};

  let updateData = new myModel ({
        userId: req.body.userId
        /*description: req.body.description,
        duration: req.body.duration,
        date: req.body.date*/
      });

      myModel.findOne({_id: req.body.userId}).then((doc2)=> {
        //updateData.save();
        doc2.description = req.body.description;
        doc2.duration = req.body.duration;
        doc2.date = req.body.date;

        doc2.save();

        //{"username":"Popa1","description":"Meme","duration":62,"_id":"HyDrAQhJU","date":"Fri Oct 06 1995"}
        myresults.username = doc2.username;
        myresults.description = doc2.description;
        myresults.duration = doc2.duration;
        myresults._id = doc2._id;
        myresults.date = doc2.date;

        console.log(myresults);

        res.send(myresults);
      });

});

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
