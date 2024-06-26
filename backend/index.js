const express=require('express')
const app=express();
const connectToMongo=require("./Db")
const port=process.env.PORT ;
var cors = require('cors');
connectToMongo();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// List of allowed origins
const allowedOrigins = [
  'https://login-and-signup-page-using-otp-verification-5bzi.vercel.app',
  'https://login-and-signup-page-using-otp-verification-te63-2evy0p411.vercel.app',
  'https://login-and-signup-page-using-git-e01a29-vaibhavsoni109s-projects.vercel.app'
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// Apply CORS middleware
app.use(cors(corsOptions));

app.use(express.static('../public'));

// app.use('/api/auth',require('./routes/auth'))
app.use("/api/auth",require("./routes/userRoutes"))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '../public/index.html');
});
app.get('/otpverification', (req, res) => {
    res.sendFile(__dirname + '../public/otpverification.html');
});
app.get('/loginuser', (req, res) => {
    res.sendFile(__dirname + '../backend/public/loginuser.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
