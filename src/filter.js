function getActiveUsers(file) {

  const filteredJSON = [];
  // si on ne sait pas si le user est actif, on définit false par défaut
  for (const user of file) {
    !user.hasOwnProperty('isActive') ? user.isActive = false : null;
    if (user.isActive === true) {
      delete user.isActive;
      user.name = user.name.replace(/"/g, '');
      user.company = user.company.replace(/"/g, '');
      filteredJSON.push(user);
    }
  }

  return filteredJSON;

}

module.exports = { getActiveUsers }