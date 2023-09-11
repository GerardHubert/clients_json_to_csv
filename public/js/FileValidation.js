/**
 * classe qui va servir à valider le fichier soumis via le formulaire
 * la classe écoute l'input file
 * si une validation ne passe pas, on affiche une erreur,
 * on peut éventuellement y ajouter d'autres validation côté front
 * si  le fichier est validé, on rend disponible le bouton convertir
 */
class FileValidation {

  constructor(fileSubmit) {
    this.inputElement = document.getElementById('file-input');
    this.convertButton = document.getElementById('convert-button');
    this.errorElement = document.getElementById('error');
    this.successElement = document.getElementById('success');

    this.inputElement.addEventListener('change', (e) => {
      this.validate(e);
    })

    this.mainElement = document.getElementById('main');
  }

  // ajouter des conditions de validations ici
  validate(e) {
    e.preventDefault();
    const file = e.target.files[0];

    if (file.type !== 'application/json') {
      this.errorElement.classList.add('show-error');
      this.errorElement.innerText = "Le fichier n'est pas un .json";
      this.convertButton.setAttribute('disabled', "disabled");
    } else {
      this.errorElement.classList.remove('show-error');
      this.convertButton.removeAttribute('disabled');
      this.convertButton.addEventListener('click', (e) => {
        this.handleClick(e, file);
      })
    }
  }

  handleClick(e, file) {
    e.preventDefault();

    const sendFile = async () => {
      const fd = new FormData();
      fd.append('file', file);
      const response = await fetch("/submit_file", {
        method: "POST",
        body: fd
      })
      const data = await response.json();

      if (response.status === 200) {

        this.successElement.classList.add('show-success');
        this.successElement.innerText = "Fichier .csv créé avec succès";

        const downloadButton = document.createElement('a');
        downloadButton.innerText = "Ouvrir le .csv";
        downloadButton.href = "ms-excel:ofe|u|file:" + data.link;
        downloadButton.classList.add('download_button');
        this.mainElement.append(downloadButton);

        downloadButton.addEventListener('click', () => {
          downloadButton.remove();
        })
      }
    }
    sendFile();
  }

}

let fileValidation = new FileValidation();