export const generateConfirmAccountEmail = (url: string) => {
  return `<div>
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
};

export const generateForgotPasswordEmail = (url: string) => {
  return `<div>
                <h1>Restablecimiento de Contraseña</h1>
                <p>
                    Por favor, haz clic en el botón de abajo 
                    para restablecer tu contraseña.
                </p>
                <a href="${url}"
                style="display:inline-block; padding:10px 20px; 
                background-color:#007BFF; color:#FFFFFF; 
                text-decoration:none; border-radius:5px;">
                Restablecer contraseña</a>
            </div>`;
};
