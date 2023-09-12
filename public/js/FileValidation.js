/**
 * classe qui va servir à valider le fichier soumis via le formulaire
 * et a envoyer les indication visuelles (fichier valide, conversion en .csv réussie...)
 * la classe écoute l'input file
 * si une validation ne passe pas, on affiche une erreur,
 * on peut éventuellement y ajouter d'autres validation côté front
 * si  le fichier est validé, on rend disponible le bouton convertir
 */
class FileValidation {

  constructor() {
    this.inputElement = document.getElementById('file-input');
    this.convertButton = document.getElementById('convert-button');
    this.errorElement = document.getElementById('error');
    this.successElement = document.getElementById('success');

    this.inputElement.addEventListener('change', (e) => {
      this.validate(e);
    })

    this.downloadButton = document.getElementById('dl-button');
  }

  // ajouter des conditions de validations ici
  validate(e) {
    e.preventDefault();
    const file = e.target.files[0];

    // on supprime les indications si l'utilisateur soumet un nouveau fichier
    this.downloadButton.classList.remove('show-download-button');
    this.successElement.classList.remove('show-success');

    if (file.type !== 'application/json') {
      this.errorElement.classList.add('show-error');
      this.errorElement.innerText = "Le fichier n'est pas un .json";
      this.convertButton.setAttribute('disabled', "disabled");
    }
    if (file.type === 'application/json') {
      this.errorElement.classList.remove('show-error');
      this.convertButton.removeAttribute('disabled');
      this.convertButton.addEventListener('click', (e) => {
        this.handleClick(e, file);
      })
    }
  }

  /**
   * Méthode pour envoyer le fichier soumis
   * et qui attend la réponse du serveur 
   */
  handleClick(e, file) {
    e.preventDefault();
    this.inputElement.value = null;

    const sendFile = async () => {
      const fd = new FormData();
      fd.append('file', file);
      const response = await fetch("http://localhost:3000/submit_file", {
        method: "POST",
        body: fd,
        credentials: "same-origin"
      });
      const data = await response.json();

      if (response.status === 200) {
        this.successElement.classList.add('show-success');
        this.successElement.innerText = "Fichier .csv créé avec succès";

        this.downloadButton.classList.add('show-download-button');
        this.downloadButton.setAttribute('href', data.link);
        this.downloadButton.setAttribute('href', "ms-excel:ofe|u|file:" + data.link);
        this.downloadButton.innerText = "Télécharger le fichier .csv";

        this.downloadButton.addEventListener('click', () => {
          this.downloadButton.classList.remove('show-download-button');
          this.successElement.classList.remove('show-success');
        })
      }
    }
    sendFile();
  }

}

let fileValidation = new FileValidation();