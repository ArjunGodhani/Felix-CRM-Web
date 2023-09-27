const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '9909998189$gt',
  database: 'upload_data'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Server!');
});

app.post('/upload-data', (req, res) => {
  const data = req.body.data;

  data.forEach(row => {
    const sql = 'INSERT INTO candidates SET ?';
    connection.query(sql, row, (err, results) => {
      if (err) throw err;
      console.log('Row inserted: ', results.insertId);
    });
  });

  res.send({ status: 'OK', message: 'Data uploaded successfully!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
