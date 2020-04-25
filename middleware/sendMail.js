var nodemailer = require("nodemailer");
var sgTransport = require("nodemailer-sendgrid-transport");

var sendMail = function (address, htmlMessage) {
  //   var transporter;
  //   var message;
  //   transporter = nodemailer.createTransport("SMTP", {
  //     service: "Mailgun",
  //     auth: {
  //       user: "{ default smtp login from mailgun }",
  //       pass: "{ default password from mailgun }",
  //     },
  //   });
  //   message = {
  //     from: "studio@roozen.nl",
  //     to: address,
  //     subject: "That was so quick!!",
  //     html: htmlMessage,
  //   };
  //   transporter.sendMail(message, function (error, info) {
  //     if (error) console.log(error);
  //     transporter.close();
  //   });

  var options = {
    auth: {
      api_user: "SENDGRID_USERNAME",
      api_key: "SENDGRID_PASSWORD",
    },
  };

  var client = nodemailer.createTransport(sgTransport(options));

  var email = {
    from: "noreply@hetkookt.nl",
    to: adress,
    subject: "Hello",
    text: "Hello world",
    html: htmlMessage,
  };

  client.sendMail(email, function (err, info) {
    if (err) {
      console.log(error);
    } else {
      console.log("Message sent: " + info.response);
    }
  });
};
module.exports = sendMail;
