const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

// API endpoint untuk mendapatkan versi Node.js yang terinstal
app.get('/api/node-versions', (req, res) => {
  exec('ls -1 /usr/local/bin/node*', (error, stdout, stderr) => {
    if (error) {
      // Default versions jika gagal mendapatkan dari sistem
      res.json(['20.11.0', '18.19.0', '16.20.2']);
      return;
    }
    
    const versions = stdout
      .split('\n')
      .filter(Boolean)
      .map(path => {
        const match = path.match(/node-v(\d+\.\d+\.\d+)/);
        return match ? match[1] : null;
      })
      .filter(Boolean)
      .sort((a, b) => {
        const [aMajor, aMinor, aPatch] = a.split('.').map(Number);
        const [bMajor, bMinor, bPatch] = b.split('.').map(Number);
        return bMajor - aMajor || bMinor - aMinor || bPatch - aPatch;
      });
    
    res.json(versions);
  });
});

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});