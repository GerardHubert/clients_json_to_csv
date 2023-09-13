const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const filter = require('./src/filter.js');
const populate = require('./src/populate.js');
const remove = require('./src/remove.js');

// middleware multer pour lire les fichiers soumis via le formulaire
const multer = require('multer');
// on définit le répertoire d'enregistrement des uploads ici
const upload = multer({ dest: 'data/uploads' });

const fs = require('fs');

app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

// c'est ici qu'on reçoit le fichier soumis par l'utilisateur
app.post('/submit_file', upload.single('file'), (req, res) => {
  let file = req.file.path;

  // on définit le répertoire d'enregistrement du .csv ici
  let fileSortie = path.join(__dirname, 'data', 'csv', 'sortie.csv');

  // on supprime l'ancien .csv s'il en existe un
  if (fs.existsSync(fileSortie)) {
    remove.removeFile(fs, fileSortie);
  }

  /**
   * on peut lire le fichier .json
   * et construire le .csv
   */
  fs.readFile(file, 'utf8', (e, fileData) => {
    if (e) {
      res.json({ 'error': e }).end();
    }
    let fileJSON = JSON.parse(fileData);

    // récupération des utilisateurs actifs
    const filteredJSON = filter.getActiveUsers(fileJSON);

    // on peuple le fichier de sortie avec un header (les propriétés) et un body
    populate.setHeader(fs, filteredJSON, fileSortie);
    populate.setBody(fs, filteredJSON, fileSortie);


  });
  res.json({ 'link': fileSortie }).end();

  // enfin, on supprime le fichier uploadé
  remove.removeFile(fs, file)
})

app.listen(port, () => {
  console.log('server running');
});