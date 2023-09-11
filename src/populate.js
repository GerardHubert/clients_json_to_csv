function setHeader(fs, file, fileSortie) {
  // extraction du header et qu'on ajoute au fichier de sortie
  let header = Object.keys(file[0]).toString();
  fs.appendFileSync(fileSortie, header + "\n", (err) => {
    if (err) throw err;
  });
  console.log("header set !");
}

function setBody(fs, file, fileSortie) {
  for (const user of file) {
    let parsedUser = Object.values(user).toString()
    fs.appendFileSync(fileSortie, parsedUser + "\n", (err) => {
      if (err) throw err;
    })
  }
  console.log("body set !!")
}

module.exports = { setHeader, setBody };