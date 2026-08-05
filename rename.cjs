const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    for (const [search, replace] of replacements) {
        content = content.split(search).join(replace);
    }
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
    }
}

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

// 1. Replace @stellar-void/ with @ajrojasfuentes/
const replaceScope = [
    ['"@stellar-void/', '"@ajrojasfuentes/'],
    ["'@stellar-void/", "'@ajrojasfuentes/"]
];

walkDir('./packages', (filePath) => {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('package.json')) {
        replaceInFile(filePath, replaceScope);
    }
});

// 2. Replace exact "stellar-void" with "@ajrojasfuentes/stellar-void" in specific files
const replaceMain = [
    ['"stellar-void"', '"@ajrojasfuentes/stellar-void"'],
    ["'stellar-void'", "'@ajrojasfuentes/stellar-void'"],
    ['"stellar-void/', '"@ajrojasfuentes/stellar-void/'],
    ["'stellar-void/", "'@ajrojasfuentes/stellar-void/"]
];

replaceInFile('./packages/stellar-void/package.json', replaceMain);
replaceInFile('../tests/package.json', replaceMain);
replaceInFile('../tests/src/components/StellarBackground.tsx', replaceMain);

// 3. Update engine.ts CDN URL
const replaceCDN = [
    ['npm/stellar-void@1.0.0', 'npm/@ajrojasfuentes/stellar-void@1.0.0']
];
replaceInFile('./packages/stellar-void/src/engine.ts', replaceCDN);
