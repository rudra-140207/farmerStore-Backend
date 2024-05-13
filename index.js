import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";


dotenv.config();

const app = express();

app.use(cors({
  origin : "http://127.0.0.1:5500",
  credentials : true,
  methods : ['POST','GET','DELETE','PUT'],
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//DB connection
mongoose
  .connect(process.env.MONGO_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on ${process.env.PORT}.`);
    });
  })
  .catch((e) => console.log("DB connection error:", e));

//DB model and schema

const orderSchema = mongoose.Schema({
    name : String,
    address : String,
    phone : Number,
    orderP: String,
    amount: Number,
    date: { type: Date, default: Date.now }
});

const orderModel = mongoose.model("Order" , orderSchema);

app.post("/order",async(req,res)=>{
    const {name , address , phone , orderP , amount} = req.body;
    try {
        if(!orderP || !amount){
            return res.status(400).json({message : "order incomplete"});
        }
        await orderModel.create({name , address , phone , orderP , amount});
        res.status(200).json({message : "Order Placed"});
    } catch (error) {
        console.log(error);
        res.status(400).json({message : "Internal Server Error"});
    }
})


app.get("/", (req, res) => {
  res.send("oh no, its working !!");
});

app.get("/wakeup",(req,res)=>{
  return res.status(200).json({message : "Initiated"});
})


