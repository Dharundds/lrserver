const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const fs = require('fs')
const cors = require('cors')({origin: true});
admin.initializeApp();

// var sender = nodemailer.createTransport({
//   service:"gmail",
//   auth:{
//     user:"dharundds@gmail.com",
//     pass:"becjaziwymugppqv"
//   }
// })

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dharundds@gmail.com',
        pass: 'becjaziwymugppqv'
    }
});

exports.contact = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const body = JSON.parse(req.body)
        // getting dest email by query string
        const fname = body.fname;
        const email = body.email;
        const phonenum = body.phonenum;
        const message = body.message;

        const mailOptions = {
            from:"dharundds@gmail.com",
            to:["dharundds@gmail.com","hrithimj003@gmail.com"],
            subject: `Enquiry submitted from Learningroom website by ${fname}`,
            html:` 
              <style>
                  span{
                    font-weight: bold;
                  } 
              </style>
              <h3>Respect Sir,</h3>
              <p>An enquiry is submitted by ${fname} and phone number: <span>${phonenum}</span>, email: <span>${email}</span> </p>
              <p>The message sent is : <span>${message}</span></p>`
        };
  
        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if(erro){
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });    
});



exports.application = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      
        // getting dest email by query string
        const file = req.file;
        const sname = req.body.sname;
        const sclass= req.body.sclass;
        
        if (!file) {
            const error = new Error("No File");
            error.httpStatusCode = 400;
            return next(error);
        }
        res.send(file);
        var a = file.originalname.split(".");
        let fileName = a[0] + "_" + file.filename + "." + a[1];
        fs.rename("uploads/" + file.filename, "uploads/" + fileName, () => {});

        const mailOptions = {
            from:"dharundds@gmail.com",
            to:["dharundds@gmail.com","hrithimj003@gmail.com"],
            subject: `Enquiry submitted from Learningroom website by ${fname}`,
            text: `The application form of the student ${sname} of class ${sclass} is attached below`,
            attachments: [
            {
                filename: `${fileName}`,
                path: `uploads/${fileName}`,
            },
    ],
        };
  
        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if(erro){
                return res.send(erro.toString());
            }
            fs.unlinkSync("uploads/" + fileName);
            return res.send("done form")
        });
    });    
});



exports.receipt = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      
        // getting dest email by query string
        const body = JSON.parse(req.body)
        const file = req.file;
        const sname = body.sname;
        const sclass = body.sclass;
        const ino = body.ino;
        let g;

        console.log(file)
        console.log(sname)

        if (ino==1){
        g='st'
        }else if (ino==2){
        g='nd'
        }else{
        g='th'
        }
        if (!file) {
        const error = new Error("No File");
        error.httpStatusCode = 400;
        return next(error);
        }
        res.send(file);
        var a = file.originalname.split(".");
        let fileName = a[0] + "_" + file.filename + "." + a[1];
        fs.rename(
        "uploadsReceipt/" + file.filename,
        "uploadsReceipt/" + fileName,
        () => {}
        );
        const mailOptions = {
            from:"dharundds@gmail.com",
            to:["dharundds@gmail.com","hrithimj003@gmail.com"],
            subject: `Enquiry submitted from Learningroom website by ${fname}`,
            subject: `Receipt for ${sname}`,
            text: `The student ${sname} of class ${sclass} has paid the ${ino}${g} installation. The receipt is attached below`,
            attachments: [
              {
                  filename: `${fileName}`,
                  path: `uploadsReceipt/${fileName}`,
              }
          ]
        };
  
        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if(erro){
                return res.send(erro.toString());
            }
            fs.unlinkSync('uploadsReceipt/'+fileName);
            return res.send("done");
        });
    });    
});