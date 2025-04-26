module.exports.sendEmail = (request, response) => {
    const msg = request.body;
    const nodemailer = require("nodemailer");

    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        secure: false,
        auth: {
            user: process.env.EMAIL_USER, // Securely using environment variable
            pass: process.env.EMAIL_PASS,
        },
    });

    // Email options
    const mailOptions = {
        from: msg.from,
        to: msg.to,
        subject: msg.subject,
        text: msg.text,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error:", error);
        } else {
            console.log("Email sent:", info.response);
            response.status(200).json({ sended: true });
        }
    });
}