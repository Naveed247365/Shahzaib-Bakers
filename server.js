const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '.')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/upload-image', (req, res) => {
    const { image, fileName } = req.body;
    const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, '');
    const filePath = path.join(__dirname, 'public/images', fileName);
    
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).json({ status: 'error', message: 'Image upload failed' });
        }
        res.json({ status: 'success', message: 'Image uploaded', path: `/public/images/${fileName}` });
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));