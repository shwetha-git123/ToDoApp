const PORT = process.env.PORT || 8000
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const app = express()
const pool = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())

//get all todos
app.get('/todos/:userEmail', async (req, res) => {

  const { userEmail } = req.params

  try {
    const [rows, fields] = await pool.query('SELECT * FROM todos WHERE user_email = ?', [userEmail]);
    console.log(rows)
    res.send(rows)
  }
  catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

// create a new todo
app.post('/todos', async (req, res) => {
  const { user_email, title, progress, date } = req.body
  console.log(user_email, title, progress, date)
  const id = uuidv4()
  console.log(id);
  try {
    const newToDo = await pool.query(`INSERT INTO todos(id,user_email,title,progress,date) VALUES(?,?,?,?,?)`,
      [id, user_email, title, progress, date])
    console.log(newToDo)
    res.send(newToDo)

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

//edit a todo
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params
  const { user_email, title, progress, date } = req.body
  try {
    const editToDo = await pool.query('UPDATE todos SET user_email=?,title=?,progress=?,date=? WHERE id=?', [user_email, title, progress, date, id])
    res.send(editToDo)
  }
  catch (err) {
    console.error(err)
  }
})

//delete a todo
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params
  const deleteToDo = await pool.query('DELETE FROM todos WHERE id=?', [id])
  res.json(deleteToDo)
  try {

  }
  catch (err) {
    console.error(err)
  }
})

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  try {
    const signUp = await pool.query(`INSERT INTO users (email, hashed_password) VALUES (?, ?)`, [email, hashedPassword]);
    const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });
    res.send({ email, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (result.length > 0) {
      res.status(200).json({ message: 'Login successful', email: email });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
