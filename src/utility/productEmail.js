const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
require("dotenv").config();

const productEmailTem = require("./productEmailTem");

let pass = process.env.PASS;
let email = process.env.EMAIL;

const productEmail = async (EmailTo, EmailSubject, product) => {
    let transporter = nodemailer.createTransport(
        smtpTransport({
            service: "Gmail",
            auth: {
                user: email,
                pass: pass,
            },
        })
    );

    let mailOptions = {
        from: `My Shop <${email}>`,
        to: EmailTo,
        subject: EmailSubject,
        html: productEmailTem(
            product.product_name,
            product.product_img,
            product.description,
            product.price,           // ✅ added
            product.discount_price   // ✅ added
        ),
    };

    return await transporter.sendMail(mailOptions);
};

module.exports = productEmail;
