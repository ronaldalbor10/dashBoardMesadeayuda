const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'outlook.office365.com',
    port: 587,
    secureConnection: true,
    secure: false,
    requireTLS: true,
    auth: {
        user: "mesadeayuda@bienestarips.com",
        pass:"Bienestar12345"
    },
    tls: {
        //ciphers:'SSLv3',
        rejectUnauthorized: false,
    }

});

module.exports = transporter;