// https://github.com/dyesmuk/ibm-html-css-js-demos/blob/main/courseware/04-node/01_04_Welcome_ModuleSystem_FS_Debugging.md#fs-module 

// // import fs from 'fs';
// // import { promises as fsp } from 'fs';
// // import path from 'path';
// // import { createReadStream, createWriteStream } from 'fs';
// // import readline from 'readline';

// // const content = 'Hello IBM';
// // const logLine = `[${new Date().toISOString()}] App started\n`;

// // // ── Synchronous (blocks the event loop — use only at startup) ──

// // // FIX: typo "f s" → fs
// // const dataSync = fs.readFileSync('./config.json', 'utf8');
// // const parsed = JSON.parse(dataSync);

// // fs.writeFileSync('./output.txt', 'Hello', 'utf8');
// // fs.appendFileSync('./log.txt', `[${new Date()}] Server started\n`);

// // // Ensure folder exists before reading
// // if (fs.existsSync('./src')) {
// //     const filesSync = fs.readdirSync('./src');
// // }

// // // Avoid crash if file missing
// // if (fs.existsSync('./file.txt')) {
// //     const stat = fs.statSync('./file.txt');
// //     stat.isFile();
// //     stat.isDirectory();
// // }

// // fs.mkdirSync('./logs', { recursive: true });
// // fs.rmSync('./temp', { recursive: true, force: true });

// // fs.existsSync('./file.txt'); // true/false


// // // ── Async with Promises (preferred for server code) ──

// // // FIX: renamed variable to avoid duplicate declaration
// // const dataAsync = await fsp.readFile('./config.json', 'utf8');

// // await fsp.writeFile('./output.txt', content, 'utf8');
// // await fsp.appendFile('./log.txt', logLine);

// // // Ensure folder exists
// // let filesAsync = [];
// // try {
// //     filesAsync = await fsp.readdir('./src');
// // } catch {
// //     // ignore if not exists
// // }

// // await fsp.mkdir('./logs', { recursive: true });
// // await fsp.rm('./temp', { recursive: true, force: true });

// // // Ensure src.txt exists before copy
// // try {
// //     await fsp.writeFile('./src.txt', 'Sample content', 'utf8');
// //     await fsp.copyFile('./src.txt', './dest.txt');
// // } catch (err) {
// //     console.log('Copy skipped:', err.message);
// // }

// // // Rename safely
// // try {
// //     await fsp.writeFile('./old.txt', 'Old file', 'utf8');
// //     await fsp.rename('./old.txt', './new.txt');
// // } catch (err) {
// //     console.log('Rename skipped:', err.message);
// // }


// // // ── Streams (for large files — don't load entire file into memory) ──

// // // Ensure source file exists
// // try {
// //     await fsp.writeFile('./large-file.csv', 'id,name\n1,Sonu\n2,Monu', 'utf8');

// //     const readStream = createReadStream('./large-file.csv', 'utf8');
// //     const writeStream = createWriteStream('./output.csv');

// //     readStream.pipe(writeStream);
// // } catch (err) {
// //     console.log('Stream error:', err.message);
// // }


// // // ── Process line by line ──

// // try {
// //     await fsp.writeFile('./data.txt', 'Line1\nLine2\nLine3', 'utf8');

// //     const rl = readline.createInterface({
// //         input: createReadStream('./data.txt'),
// //         crlfDelay: Infinity
// //     });

// //     for await (const line of rl) {
// //         console.log(line);
// //     }
// // } catch (err) {
// //     console.log('Readline error:', err.message);
// // }









// import path from 'path';

// // __dirname equivalent in ES modules
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // JOIN
// console.log(path.join('/usr', 'local', 'bin'));
// console.log(path.join(__dirname, 'data', 'file.json'));

// // RESOLVE
// console.log(path.resolve('src', 'index.js'));
// console.log(path.resolve('/base', 'src', 'file'));

// // BASENAME / EXTNAME / DIRNAME
// console.log(path.basename('/path/to/file.js'));
// console.log(path.basename('/path/to/file.js', '.js'));

// console.log(path.extname('file.html'));
// console.log(path.dirname('/path/to/file.js'));


// // PARSE & FORMAT
// console.log(path.parse('/path/to/file.js'));
// // { root:'/', dir:'/path/to', base:'file.js', ext:'.js', name:'file' }

// console.log(path.format({ dir: '/path/to', base: 'file.js' }));


// // ABSOLUTE CHECK
// console.log(path.isAbsolute('/usr/local'));
// console.log(path.isAbsolute('src/index'));   











// app.js
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// --- Minimal in-memory store ---
const notes = [];

// --- Functions (missing earlier) ---
function addNote(title, body) {
  notes.push({ title, body });
  console.log('Note added!');
}

function listNotes() {
  return notes;
}


// --- CLI setup ---
yargs(hideBin(process.argv))
  .command({
    command: 'add',
    describe: 'Add a new note',
    builder: {
      title: { describe: 'Note title', type: 'string', demandOption: true },
      body:  { describe: 'Note body',  type: 'string', demandOption: true }
    },
    handler(argv) {
      console.log(`Adding: "${argv.title}"`);
      addNote(argv.title, argv.body);
    }
  })
  .command({
    command: 'list',
    describe: 'List all notes',
    handler() {
      listNotes().forEach(n => console.log(`- ${n.title}`));
    }
  })
  .demandCommand(1)
  .help()
  .argv;