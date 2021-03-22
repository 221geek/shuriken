import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(bodyParser.json({limit: `50mb`, type: `application/json`}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.use(express.static("assets"));

app.get('/', (req: Request, res: Response) => {
    res.render('../template/home.ejs');
});

export { app };
