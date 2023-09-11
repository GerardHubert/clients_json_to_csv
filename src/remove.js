function removeFile(fs, fileToDelete) {
  fs.unlink(fileToDelete, (err) => {
    if (err) throw err;
  })
}

module.exports = { removeFile };