const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const {google} = require('googleapis');


async function getAuthSheets(){

    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    const client = await auth.getClient();
   
    const googleSheets = google.sheets({version: 'v4', auth: client});

   const spreadsheetId = "1Tb6sMJ17z98Owp117VGyN1emH_uL_MRy-ksuVay_gD8"

    return {auth,client, googleSheets, spreadsheetId};
}

router.get("/metadata", async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
  
    const metadata = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId,
    });
  
    res.send(metadata.data);
  });

  router.get("/getRows", async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
  
    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "Página1",
      valueRenderOption: "UNFORMATTED_VALUE",
      dateTimeRenderOption: "FORMATTED_STRING",
    });
  
    res.send(getRows.data);
  });
  

  router.post("/addRow", async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
  
    const { values } = req.body;
  
    const row = await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Página1",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: values,
      },
    });
  
    res.send(row.data);
  });
  

router.post('/contato', (req, res) => {
    let transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465, // Porta SSL para o Gmail
        secure: true, // true para usar SSL
        auth: {
            user: "clinica@biodinamicasaude.com.br", // Substitua pelo seu endereço de e-mail do Gmail
            pass: "pjor qvus kznj awym" // Substitua pela sua senha do Gmail
        }
    });

    let mensagem = {
        from: 'clinica@biodinamicasaude.com.br',
        to: 'clinica@biodinamicasaude.com.br',
        subject: req.body.subject,
        text: req.body.text
    };

    transport.sendMail(mensagem, function (erro) {
        if (erro) {
          console.log(erro);
            return res.status(400).send({ Erro: 'Erro ao enviar o email' });
        } else {
            return res.send({ Ok: 'Email enviado com sucesso' });
        }
    });
});

module.exports = router;
