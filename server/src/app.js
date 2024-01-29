import express from "express"
import cors from "cors"
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";



const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({limit: "30mb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(express.static("public"))
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))



/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage });

  


import { registerUser } from "./controllers/user.controller.js"

app.post("/auth/register" , upload.single("picture"),registerUser);
export { app }