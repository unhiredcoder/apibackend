// var r=require("http");
// const server=r.createServer((req,res)=>{
//     res.end("maruuuu")
// })

// server.listen(4000,"localhost",()=>{
//     console.log("hiii bro")
// })

// var t=require("fs")
// t.writeFileSync("./sample.txt","i am sampl textrrrrr inside text file")


// var t=require("fs")
// t.readFile("./sample.txt","utf-8",(req,res)=>{
//     console.log(res)
// })

// let y=require("path")
// console.log(y.extname("/node/index.js"))

// var o=require("os")
// console.log(o.freemem/1024/1024/1024)

// app.get("/about",(req,res)=>{
//     res.send("<h1>kya jan na hai ?</h1>")
// })
// app.get("/home",(req,res)=>{
//     res.send("<h1>ghar pr swagat hai </h1>")
// })

// app.get('*', (req, res) => {
//     res.status(404).send('Sorry, the requested page does not exist');
//   });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const express = require("express")
require('dotenv').config();
const mongoose = require("mongoose")
const Phone = require("./user")
const app = express();
let path = require("path")
const PORT = process.env.PORT || 4000;
const cors = require('cors');
app.use(cors());
const url = process.env.URL;
app.use(express.json()); // add json middleware to parse incoming request data ,if not use this u get {} or error like name npt found while destructring
app.use(express.json())    //this is used otherwise u get error like name is not found while destructuring orr {} or not receving while sending response as json
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// body-parser.json() is used to parse JSON data in the request body, 
// whereas body-parser.urlencoded() is used to parse form data in the request body.

//$$$$$$$$$$$  here started whole jsfile send operation $$$$$$$$$$$$$$$$$$$$$$
// const phonesData = require('./phones.json');
// console.log(phonesData.phones)
// const jsonData = JSON.parse(fs.readFileSync(jsonFile)); 

// Phone.insertMany(phonesData.phones)
//   .then(() => {
//     console.log(`Saved all phones to the database`);
//   })
//   .catch((error) => {
//     console.error(error);
//   });








app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"))
})


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

  .then(() => console.log('Connected to Database'))

  .catch((err) => { console.error(err); });

// app.get("/user",(req,res)=>{
// user.find().then((user1)=>{    //same like below but better use .then is more profitable then async await (for me only)
// console.log(user1)
// })
// })


app.set('view engine', 'ejs')
app.get("/phones", async (req, res) => {
  try {
    const phones = await Phone.find();
    // res.send(user1)     
    res.render("hiii", { phones });  // either user.send(user1) or this called cannot called at the same time call what u need 
    //hiii.ejs is the file name inside view folder  & user1 is the content which pass as a prop
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});



app.get('/json', async (req, res) => {
  try {
    const users = await Phone.find();
    res.send(users)
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Something went wrong' });
  }
});










app.post('/insert', async (req, res) => {
  const { brand, name, price, image } = req.body;
  const existingUser = await Phone.findOne({ name });
  if (existingUser) {
    console.log('Username already exists in the database!');
    return res.status(400).send('Username already exists in the database!');
  } else {
    try {
      const data = new Phone({
        name: name,    // add a new property to the schema
        brand: brand,
        price: price,
        image: image
      });
      await data.save();
      res.send(
        `<a href="/">Data saved successfully, now go home</a>  or <a href="/phones">go to user111</a>  or <a href="/json">user</a>  `
      );
    } catch (error) {
      console.error(error);
      res.status(500).send('Error saving data!');
    }
  }
});




//this is to update element by id by sending data as a response i.e json() format
app.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;    // use content type= application/json
    const { name, brand, price, image } = req.body;    //every time ctrl+s in body json of thunderclient
    let update = { name, brand, price, image }
    const options = { new: true };  //new:true for returnig updated value
    await Phone.findByIdAndUpdate(id, update, options);    //bodyparser.json() is important
    res.send(`all data  is saved successfully saved in database`);
  }
  catch (e) {
    console.log(e);
    res.status(500).json({ error: "Unable to update phone." });
  }
});





app.get("/update/:id", async (req, res) => {
  try {
    // const name = req.query.name; //     this is filter & read the name value from query parameter
    // const name = req.query.brand; //   we can use this  filter also at a same time if more comdata  & read the brand value from query parameter
    // const price = req.query.price; // read the price value from query parameter     ===========1ST========WAY=====
    // const options = { new: true };   // to return the changed value
    // const updateObj = {
    //   name: req.query.name,
    //   price:req.query.price,                                   //===============2ND============WAY================
    //   brand: req.query.brand,
    // };
    const { name, brand, price, image } = req.query;             //===============3RD============WAY================
    let updateObj = { name, brand, price, image: image ? `https://${image}` : undefined };   //if ONE IS CHANGED COZ OF OTHER CHANGING

    // if (req.query.image) {
    //   updateObj.image = `https://${req.query.image}`;     //can use this instead of ternery
    // }
    console.log(updateObj)
    const updatedPhone = await Phone.findOneAndUpdate(
      //below both id is a type of filter
      { _id: req.params.id }, //QUERY STRING:-- update/6433988  or IN ROUTE ==> /update/:id
      // { _id: req.query.id}, // QUERY STRING:-- update?id=643398 OR IN ROUTE ==> /update
      // filter to find the document to update  you can pass above name ,price  instead of thisy
      // { name: req.query.name,price: req.query.price, brand: req.query.brand, image:`https://${req.query.image}`}, // update the price directly and image 
      updateObj,
      // also update everything
      // { brand: req.query.brand }, //  THIS IS WRONG AND DOES NOT  DO CHANGES
      { new: true } // options to return the updated document
    );
    // await updatedPhone.save();
    if (!updatedPhone) {
      return res.status(404).json({ error: "Phone not found." });
    }
    res.json(updatedPhone);
  }
  catch (e) {
    console.log(e);
    res.status(500).json({ error: "Unable to update phone." });
  }
});








app.listen(PORT, () => {
  console.log("server is working on port 4000")
})


// Read PDF file as buffer
// const fs=require("fs")
// const path = require('path');

// Replace 'file.pdf' with the name of your PDF file
// const pdfPath = path.join(__dirname, './mypdf.pdf');
// console.log('PDF path:', pdfPath);
// const o=fs.readFileSync(pdfPath)
// console.log(o)




