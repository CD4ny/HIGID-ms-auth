const generateEmailConfirmPage = (url: string) =>
  `<div>
        <h1>Confirmación de Correo Electrónico</h1>
        <p>
        Por favor, haz clic en el botón de abajo 
        para confirmar tu dirección de correo electrónico.
        </p>
        <a href="${url}"
        style="display:inline-block; padding:10px 20px; 
        background-color:#007BFF; color:#FFFFFF; 
        text-decoration:none; border-radius:5px;">
        Confirmar correo</a>
    </div>`;

export default generateEmailConfirmPage;
