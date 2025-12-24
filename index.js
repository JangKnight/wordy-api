import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config(".env");
import fs from "fs";


import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import morgan from "morgan";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;
const access_string = "Hello Express.js!";
const logger = (req, res, next) => {
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);
  next();
};
const daysOfWeek = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};
const getToday = () => {
  const today = new Date();
  const dayIndex = today.getDay();
  return daysOfWeek[dayIndex];
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
  try {
    let open_weather_api_key = process.env.OPEN_WEATHER_API_KEY;
    let f_temp;
    let response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=Atlanta&appid=${open_weather_api_key}`,
    );
    f_temp = ((response.data.main.temp - 273.15) * (9 / 5) + 32).toFixed(0);
    console.log(f_temp);
    res.render("index", {
      today: getToday(),
      temp: f_temp,
    });
  } catch (error) {
    console.log(error);
    res.render("index", {
      today: "error",
      temp: "error",
    });
  }
});

app.get("/home", (req, res) => {
  res.redirect(301, "/");
});

app.post("/home", async (req, res) => {
  console.log("POST");
  if (req.body.message === access_string) {
    res.render("user-home", {
      today: getToday(),
    });
  } else {
    res.redirect(301, "/");
  }
});

app.get("/note", (req, res) => {
  res.render("note", { today: getToday() });
});

app.post("/note", async (req, res) => {
    try {
        await fs.access('notes.json');
        console.log('note file exists!');
    } catch {
        console.log('note file does not exist');
    }

    let data;
    let notes = {}
    let new_id;

    try {
        data = await fs.promises.readFile('notes.json', 'utf8');
        notes = JSON.parse(data);

    } catch (error) {
        console.log("data does not exist");
    }

    const ids = Object.keys(notes).map(Number);
    new_id = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    console.log(Math.max(...ids), ids.length);

    notes[new_id ] = {
        msg: req.body.message,
        type: req.body.type
    };

    await fs.promises.writeFile('notes.json', JSON.stringify(notes, null, 2), 'utf8');

    res.json({ success: true, id: new_id });
    
    console.log("POST");
});

app.put("/note", (req, res) => {
  res.redirect(200, "/");
  console.log("PUT");
});

app.patch("/note", (req, res) => {
  res.redirect(200, "/");
  console.log("PATCH");
});

app.delete("/note", (req, res) => {
  console.log("DELETE");
});

app.get("/about", (req, res) => {
  res.send("<h1>About page</h1>" + "<p>Hey, I'm Anthony</p>");
});

app.get("/contact", (req, res) => {
  res.send(
    "<h1>Ways to contact me:</h1>" +
      "<table>" +
      "<tr>" +
      "<td>Email:</td>" +
      "<td>anthonysjhenry@icloud.com</td>" +
      "</tr>" +
      "<tr>" +
      "<td>Phone:</td>" +
      "<td>123-456-7890</td>" +
      "</tr>" +
      "</table>",
  );
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
