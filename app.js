const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

var port = process.env.PORT || 8000

//View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Boby Parser Middleware
//https://github.com/expressjs/body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static folder
app.use('/public',express.static(path.join(__dirname, 'public')));


app.get('/',(req, res)=>{
    res.render('contact');
    //res.rander('index');
    //res.send('Hello world');


});

app.post('/send',(req, res)=>{
    console.log(req.body);
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Company: ${req.body.company}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'mail.anaxanet.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'noreply@mylocal.help', // generated ethereal user
            pass: 'Miao196309$'  // generated ethereal password
        },
        tls:{
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"MyLocal.Help" <noreply@mylocal.help>', // sender address
        to: 'yyandhh@gmail.com, m.yyandhh@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html:  output//'<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('contact', {msg: 'Email had been sent'})
    });

});

app.listen(port, ()=>{
    console.log('Service started v1.0.3....');
})
