const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", "views");
app.set("view engine", "ejs");

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DBNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
});

db.connect((error) => {
    if (error) {
        console.error('Error connecting to the database:', error);
        return;
    }
    console.log('Database connected');

    // Untuk mendapatkan data
    app.get("/", (req, res) => {
        const sql = "SELECT * FROM mahasiswa";
        db.query(sql, (error, result) => {
            if (error) {
                console.error('Error executing query:', error);
                res.status(500).send('Database query error');
                return;
            }
            const data = JSON.parse(JSON.stringify(result));
            console.log('Hasil database =>', data);
            res.render("index", { mahasiswa: data, title: "Welcome Rayhan" });
        });
    });

    // Untuk menambahkan data
    app.post("/insert", (req, res) => {
        const insert = `INSERT INTO mahasiswa (nama, prodi) VALUES ('${req.body.nama}', '${req.body.prodi}');`;
        db.query(insert, (error, result) => {
            if (error) {
                console.error('Error executing insert query:', error);
                res.status(500).send('Database insert error');
                return;
            }
            res.redirect("/");
        });
    });
});

app.listen(5000, () => {
    console.log('Server ready...');
});
