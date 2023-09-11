function getActiveUsers(file) {
  // si on ne sait pas si le user est actif, on définit false par défaut
  for (const user of file) {
    !user.hasOwnProperty('isActive') ? user.isActive = false : null
  }

  // ensuite on filtre en ne gardant que les users actifs
  const filteredJSON = file.filter((user) => user.isActive === true)

  // on supprime la propriété isActive pour ne pas avoir à l'afficher dans le .csv
  for (const user of filteredJSON) {
    delete user.isActive;
  }
  console.log("active users filtered");
  return filteredJSON;
}

module.exports = { getActiveUsers }