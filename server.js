// Node.js server A/B testi tulemuste salvestamiseks
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const RESULTS_FILE = 'testi-tulemused.txt';

// MIME tüübid erinevate failitüüpide jaoks
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.txt': 'text/plain'
};

// Loo server
const server = http.createServer((req, res) => {
    // CORS päised (luba päringud brauserist)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // OPTIONS päringu käsitlemine (CORS preflight)
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // POST päring - salvesta andmed
    if (req.method === 'POST' && req.url === '/salvesta') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const andmed = JSON.parse(body);
                
                // Formateeri andmed tekstiks (toeta nii test1 kui test2)
                let tekst = '';
                
                if (andmed.test === 'Test2') {
                    // Testi 2 andmed (toodete valik)
                    tekst = `${andmed.test}, Variant: ${andmed.variant}, Valik: ${andmed.valik}, Valikute arv: ${andmed.valikuteArv}, Aeg: ${andmed.aeg}\n`;
                } else {
                    // Testi 1 andmed (klikkide test)
                    tekst = `Variant: ${andmed.variant}, Klikkide arv: ${andmed.klikkideArv}, Aeg: ${andmed.aeg}\n`;
                }
                
                // Lisa andmed faili (append)
                fs.appendFileSync(RESULTS_FILE, tekst, 'utf8');
                
                console.log('Salvestatud:', tekst.trim());
                
                // Saada vastus
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Andmed salvestatud' }));
            } catch (error) {
                console.error('Viga andmete töötlemisel:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }
    
    // GET päring - serveeri staatilised failid
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Faili ei leitud</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Serveri viga: ${error.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Käivita server
server.listen(PORT, () => {
    console.log(`Server töötab aadressil http://localhost:${PORT}`);
    console.log(`Tulemused salvestatakse faili: ${RESULTS_FILE}`);
    
    // Loo tulemuste fail, kui seda pole
    if (!fs.existsSync(RESULTS_FILE)) {
        fs.writeFileSync(RESULTS_FILE, 'A/B Testi Tulemused\n==================\n\n', 'utf8');
        console.log(`Loodud uus fail: ${RESULTS_FILE}`);
    }
});

