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

app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})

// c'est ici qu'on reçoit le fichier
app.post('/submit_file', upload.single('file'), (req, res) => {
  let file = req.file.path;

  /**
   * on définit le répertoir d'enregistrement du .csv ici
   */
  let fileSortie = path.join(__dirname, 'data', 'csv', 'sortie.csv');

  // on supprime l'ancien .csv s'il existe déjà
  if (fs.existsSync(fileSortie)) {
    remove.removeFile(fs, fileSortie);
  }

  fs.readFile(file, 'utf8', (e, fileData) => {
    if (e) {
      res.json({ 'error': e })
    }
    let fileJSON = JSON.parse(fileData);
    let tailleJSON = fileJSON.length + 1;

    // récupération des utilisateurs actifs
    const filteredJSON = filter.getActiveUsers(fileJSON);

    // on peuple le fichier de sortie avec un header (les propriétés) et un body
    populate.setHeader(fs, filteredJSON, fileSortie);
    populate.setBody(fs, filteredJSON, fileSortie);

    // enfin, on supprime le fichier uploadé
    remove.removeFile(fs, file)

    res.status(200).json({ 'link': fileSortie });
  });
})

app.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT ${port}`)
})