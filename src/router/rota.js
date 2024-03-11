const express = require('express')
const nodemailer = require('nodemailer')
const router = express.Router()


router.post('/contato', (req, res)=>{
    let transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,      
      auth: {
        user: 'benolopesdias@gmail.com', // Seu email
        pass: 'abkdzzztgadalkhz', // Sua senha
      },
      });

    let mensagem ={
        from:'benolopesdias@gmail.com' ,
        to: req.body.from,
        subject: req.body.subject,
        html: req.body.email,
        text: req.body.email     
    }
     transport.sendMail(mensagem, function (erro){
        if(erro) return res.status(400).send({Erro: 'Erro ao enviar o email'})
     })
     return res.send({
        Ok: 'Email enviado com sucesso'
     })

})



module.exports = router