const express = require('express')
const morgan = require('morgan')
const mysql = require('mysql2')
require('dotenv').config()
const cors = require('cors')
const app = express();

app.use(cors({ origin: "*" }))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"))
app.use(express.json())

// before starting the web server: 
// create DB with table 'campaigns' -> campaigns.sql

// Create a MySQL pool with RDS endpoint
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
})

/**async function getCampaign(id) {
  const [campaigns] = await pool.promise().query("SELECT * FROM campaigns WHERE id = ?", [
    id,
  ])
  return campaigns[0]
}*/

// test Node.js web server on its port
app.get("/test", (req, res) => {
  res.send("<h1>BB Charity website is working 🤗</h1>")
})

// GET all campaigns through API
app.get('/campaigns', async (req, res) => {
  pool.query('SELECT * FROM campaigns', (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send(results);
    }
  });
});

// GET a single campaign with a specific id 
app.get('/campaigns/:id', (req, res) => {
  const id = req.params.id;
  pool.query('SELECT * FROM campaigns WHERE id = ?', id, (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else if (results.length === 0) {
      res.status(404).send(`Campaign with id ${id} not found`);
    } else {
      res.send(results[0]);
    }
  });
});
/**app.get("/campaigns/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id) || await randomId()
    const campaign = await getCampaign(id)
    res.send(campaign)
  } catch (error) {
    res.send(error)
  }
})*/

// POST a new campaign
app.post('/campaigns/create', (req, res) => {
  const { name, amount } = req.body;
  pool.query('INSERT INTO campaigns (name, amount) VALUES (?, ?)',
    [name, amount],
    (error, results) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send(results);
      }
    }
  );
});

// PUT (update) an existing campaign
app.put('/campaigns/update/:id', (req, res) => {
  const id = req.params.id;
  const { name, amount } = req.body;
  pool.query(
    'UPDATE campaigns SET name = ?, amount = ? WHERE id = ?',
    [name, amount, id],
    (error, results) => {
      if (error) {
        res.status(500).send(error);
      } else if (results.affectedRows === 0) {
        res.status(404).send(`Campaign with id ${id} not found`);
      } else {
        res.send(results);
      }
    }
  );
});

// DELETE all campaigns -> all the records will be deleted!
app.delete('/campaigns/delete/all', (req, res) => {
  pool.query('DELETE FROM campaigns', (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send(results);
    }
  });
});

// DELETE a single campaign
app.delete('/campaigns/delete/:id', (req, res) => {
  const id = req.params.id;
  pool.query('DELETE FROM campaigns WHERE id = ?', id, (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else if (results.affectedRows === 0) {
      res.status(404).send(`Campaign with id ${id} not found`);
    } else {
      res.send(results);
    }
  });
});

// Start the server on a specified port
const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Listening on port ${port}`))