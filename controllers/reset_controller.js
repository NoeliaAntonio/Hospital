var express = require('express');
var flash = require ('flash');
var router = express.Router();
var bodyParser = require('body-parser');
//var async = require ('async');
var nodemailer = require('nodemailer');
//var crypto = require ('crypto');
var randomToken = require ('random-token');
var db = require.main.require ('./models/db_controller');

router.get('/',function(req,res){
    res.render('resetpassword.ejs');
});

router.post('/',function(req,res){

    var email = req.body.email;
    db.findOne(email,function(err,result1){
       // console.log(result);
        if(!result1){
           console.log("el correo no existe");
            res.redirect('back');
        }
        var id = result1[0].id;
        var email = result1[0].email;
        var token = randomToken(8);
        db.temp(id,email,token,function(err,result2){
            var output =  `
            <p>Estimado usuario, </p>
            <p>Está recibiendo este correo electrónico porque solicitó restablecer su contraseña.</p>
            <p>Su nueva contraseña ha sido generada. Inicie sesión con la nueva contraseña proporcionada.</p>
            <ul>
                <li>User ID: `+ id + `</li>
                <li>Token: `+ token + `</li>
            </ul>
            <p>Login Link: <a href="http://localhost:3000/login">LOGIN</a></p>
            <p>Puede cambiar su contraseña después de iniciar sesión en la sección  - ACCOUNT SETTINGS</p>
            <p><strong>Este es un correo generado automáticamente. Por favor no respondas.</strong></p>
            
            <p>Regards,</p>
            <p>H Manager</p>
        `;
        
        var transporter = nodemailer.createTransport({
            service : 'gmail',
            auth: {
                user: '',
                pass: ''
            }

        });

        var mailOptions = {

            from: 'noeliapaolaantoni@gmail.com', // dirección del remitente
            to: email, // lista de receptores
            subject: 'Password Reset', // Línea de asunto
            html: output// cuerpo de texto plano
        };

        transporter.sendMail(mailOptions,function(err,info){
            if(err) {
                return console.log(err);
            }
            console.log(info);
        });

        });

    })

    res.send("Se ha enviado un token a su cuenta.");
    
    
});



module.exports = router;
