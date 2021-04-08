const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId

const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: false }));



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dwn45.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



client.connect(err => {
  const booksCollection = client.db(`${process.env.DB_NAME}`).collection("books");

  app.get('/checkout/:id', (req, res) => {
    booksCollection.findOne({_id: ObjectId(req.params.id)})
     .then(book=>{
       res.json(book)
     })
   })



app.get('/books', (req, res) => {
  booksCollection.find()
   .toArray((err, docs) => {
       res.send(docs)
   })
 })
 

 const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orders")
 app.get('/orders', (req, res) => {
     orderCollection.find()
   .toArray((err, docs) => {
       res.send(docs)
   })
 })

 
 app.post('/addorder', (req, res) => {
  const addorder = req.body;
  console.log('adding new event: ', addorder)

  orderCollection.insertOne(addorder)
  .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0)
  })
})





  app.post('/addBook', (req, res) => {
    const newEvent = req.body;
    console.log('adding new event: ', newEvent)

    booksCollection.insertOne(newEvent)
    .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})

app.delete('/delete/:id' , (req, res) => {

    booksCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result =>{
      res.send(result.deletedCount > 0)
    })
})

//checkout
// app.get('/laptop/:id', (req, res) => {
//   laptopsCollection.find({_id: ObjectId(req.params.id)})
//   .toArray((err, documents) => {
//       res.send(documents[0]);
//   })
// });
  console.log("connected");
});






// app.get('/', (req, res) => {
//   res.send('Hello')
// })




app.listen(`${port}`)
