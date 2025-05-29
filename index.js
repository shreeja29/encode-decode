const express = require('express');
const cors = require('cors');

const { encode } = require('./encode-decode/encode');
const { decode } = require('./encode-decode/decode');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
}));

app.use(express.json());

app.post('/encode', (req, res) => {
  try {
    const { text } = req.body;
    if (typeof text !== 'string') {
      return res.status(400).json({ error: 'Invalid input: text must be a string' });
    }
    const encoded = encode(text);
    res.json({ encoded });
  } catch (error) {
    res.status(400).json({ error: error.message, code: error.code });
  }
});

app.post('/decode', (req, res) => {
  try {
    const { encoded } = req.body;
    console.log({encoded});
    
    if (typeof encoded !== 'string') {
      return res.status(400).json({ error: 'Invalid input: text must be a string' });
    }
    const decoded = decode(encoded);
    console.log({decoded});
    
    res.json({ decoded });
  } catch (error) {

    
    res.status(400).json({ error: error.message, code: error.code });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Cipher server running on port ${PORT}`);
});
