const express=require('express')
const app=express();
const connectToMongo=require("./Db")
const port=process.env.PORT ;
var cors = require('cors');
connectToMongo();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use(express.static('../public'));

// app.use('/api/auth',require('./routes/auth'))
app.use("/api/auth",require("./routes/userRoutes"))

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '../public/index.html');
});
app.get('/otpverification', (req, res) => {
    res.sendFile(__dirname + '../public/otpverification.html');
});
app.get('/loginuser', (req, res) => {
    res.sendFile(__dirname + '../backend/public/loginuser.html');
});
app.get('/', (req, res) => {
    res.json({"jai shree ram"})
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
