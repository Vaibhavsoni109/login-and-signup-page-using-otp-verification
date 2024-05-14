const express=require('express')
const app=express();
const connectToMongo=require("./Db")
const port=process.env.PORT ;
var cors = require('cors');
connectToMongo();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
   'login-and-signup-page-using-otp-verification.vercel.app',
    'http://127.0.0.1:5500', // Add this line
    
  ];
  
  const corsOptions = {
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  };
  
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
