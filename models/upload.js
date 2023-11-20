const { Schema, model } = require("mongoose");
require("dotenv").config();
const transporter = require("../config/mail");

const fileUploadSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  tags: {
    type: String,
  },
  email: {
    type: String,
  },
});

fileUploadSchema.post("save", async function (doc) {
  try {
    console.log(doc); //whatever entry is created in database that is doc

    // send mail
    let info = await transporter.sendMail({
      from: '"Subham 👻" <Subham@example.com>', // sender address
      to: doc.email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: `<h2>Hello cloudinary image uploaded</h2> <p>View here : </p> <a href=${doc.imageUrl} >${doc.imageUrl}</a> `, // html body
    });

    // console.log(info);
  } catch (error) {
    console.error(error);
  }
});

//middleware must be created before creating model of our schema
const FILEUPLOAD = model("fileUpload", fileUploadSchema);

module.exports = FILEUPLOAD;
