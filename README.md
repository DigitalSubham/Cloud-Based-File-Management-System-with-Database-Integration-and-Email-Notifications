# File Upload

## what the project does?
This project integrates Cloudinary for file uploads, MongoDB for database storage, and incorporates an email notification system. 

Created a starter code like setup index.js, models, routes, controllers,models and config(in config database.js is for connection to database to server and cloudinary is for connecting cloudinary to server)

for file uploading i am using express-fileupload middleware

### localUpload (http://localhost:3000/api/v1/upload/localUpload)
(take data from client and store on server(localUpload controller and http://localhost:3000/api/v1/upload/localUpload))

This code defines a function called localUpload for handling file uploads on the server.  
Fetch File:

Extracts the uploaded file from the incoming request.
Log File Information:

Prints details about the file to the console.
Define File Path:

Creates a unique file path using the current directory, a "files" subdirectory, a timestamp, and the original file extension.
Move File to Path:

Moves the uploaded file to the specified path on the server.
Send Response:

Sends a success message back to the client in JSON format.
Error Handling:

If any errors occur during the process, it logs an error message to the console.
In simpler terms, this code is a server-side function to handle uploading files, storing them in a specific location, and responding to the client with success or error messages.

### imageUpload to Cloudinary and save entry to database(http://localhost:3000/api/v1/upload/imageUpload)

```
async function uploadFileToCloudinary(file, folder, quality) {
  const options = { folder };
  if (quality) {
    options.quality = quality;
  }
  options.resource_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}
```


This function uploads a file to clodinary
- folder is in which folder in cloudinary i want to store file
- quality is used to reduce the file size
- file.tempFilePath => Data from the client comes to a temporary location on the server, from where it is then transferred to Cloudinary. After the data is successfully transferred, it is deleted from the temporary location (tempFilePath) on the server.


```
function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}
```

This function checks whether file uploaded by client is supported or not

### imageUpload controller

This code defines a function named imageUpload that handles the process of uploading an image file to Cloudinary and then saving relevant information to a database.

1. Request Parsing:

```
const { name, tags, email } = req.body;
const file = req.files.imageFile;
```
- Extracts data from the request body, including name, tags, and email.
- Retrieves the uploaded image file from the request (req.files.imageFile).

2. File Type Validation:

```
const supportedTypes = ["jpg", "jpeg", "png"];
const fileType = file.name.split(".")[1].toLowerCase();
```
- Defines an array of supported file types (jpg, jpeg, png).
- Extracts the file type from the uploaded file's name and converts it to lowercase.

3. File Type Check:
```
if (!isFileTypeSupported(fileType, supportedTypes)) {
  return res.status(400).json({
    success: false,
    message: "file type not supported",
  });
}
```
- Calls a function (isFileTypeSupported) to check if the extracted file type is supported.
- If the file type is not supported, it returns a response indicating failure.

4. Cloudinary Upload:
```
const response = await uploadFileToCloudinary(file, "fileUpload");
```
- Calls the uploadFileToCloudinary function to upload the file to Cloudinary.
- The file is uploaded to a folder named "fileUpload."

5. Database Entry:

```
const fileData = await FILEUPLOAD.create({
  name,
  tags,
  email,
  imageUrl: response.secure_url,
});
```
- Creates a new entry in the database (FILEUPLOAD) with the extracted name, tags, email, and the Cloudinary URL (response.secure_url) of the uploaded image.

6. Response:
```
res.json({
  success: true,
  imageUrl: response.secure_url,
  message: "image uploaded to Cloudinary successfully",
});
```
- Responds with a JSON object indicating success, the Cloudinary image URL, and a success message.

7. Error Handling:

```
catch (error) {
  console.error(error);
  res.status(400).json({
    success: false,
    message: "something went wrong",
  });
}
```
- Catches any errors that might occur during the process and responds with a failure message and status if an error occurs.


### videoUpload to Cloudinary and save entry to database(http://localhost:3000/api/v1/upload/videoUpload)

This code defines a function named videoUpload that handles the process of uploading a video file to Cloudinary and saving relevant information to a database.

- Extracts data from the request body, including name, email, and tags.
- Retrieves the uploaded video file from the request (req.files.videoFile). from clientside filename must videoFile

- Defines an array of supported video file types (mp4, mov).
- Extracts the file type from the uploaded file's name and converts it to lowercase.

- Calls a function (isFileTypeSupported) to check if the extracted file type is supported.
- If the file type is not supported, it returns a response indicating failure.

- Calls the uploadFileToCloudinary function to upload the video file to Cloudinary.
  The file is uploaded to a folder named "fileUpload."

- Creates a new entry in the database (FILEUPLOAD) with the extracted name, tags, email, and the Cloudinary URL (response.secure_url) of the uploaded video.

- Responds with a JSON object indicating success, the Cloudinary video URL, and a success message.

- Catches any errors that might occur during the process and responds with a failure message and status if an error occurs.

### Reduce image size using quality attribute and upload image to Cloudinary and save entry to database(http://localhost:3000/api/v1/upload/imageReducer)

- Extracts data from the request body, including name, tags, and email.
- Retrieves the uploaded image file from the request (req.files.imageReducer).

- Defines an array of supported file types (jpg, jpeg, png).
- Extracts the file type from the uploaded file's name and converts it to lowercase.

- Calls a function (isFileTypeSupported) to check if the extracted file type is supported.
- If the file type is not supported, it returns a response indicating failure.

- Calls the uploadFileToCloudinary function to upload the image file to Cloudinary.
- The file is uploaded to a folder named "fileUpload" with a specified quality reduction of 30.

- Creates a new entry in the database (FILEUPLOAD) with the extracted name, tags, email, and the Cloudinary URL (response.secure_url) of the uploaded image.

- Responds with a JSON object indicating success, the Cloudinary image URL, and a success message.

- Catches any errors that might occur during the process and responds with a failure message and status if an error occurs.

In index.js

```
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
```

- fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }): This line configures the fileUpload middleware with specific options:
- useTempFiles: true: Indicates that the uploaded files should be stored as temporary files on the server.
- tempFileDir: "/tmp/": Specifies the directory where temporary files should be stored. In this case, it's set to "/tmp/".

So, when a request is made to the server with file uploads, this middleware will handle the file uploads, store them temporarily in the specified directory ("/tmp/"), and make the files accessible through the req.files object for further processing in the route handlers that come after this middleware in the request-response cycle. This is often used in conjunction with routes that handle file uploads, like the imageUpload and videoUpload functions you provided earlier.

#### At last we add feature when we add entry to database send a notification email that email has cloudinary url

in mail.js

```
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

module.exports = transporter;
```

- Imports the Nodemailer library, which allows you to send emails from Node.js applications.
- Creates an email transporter using nodemailer.createTransport().
- The transporter configuration includes the mail host, username (user), and password (pass) obtained from environment variables (process.env).
- The use of an environment variable (process.env) suggests that sensitive information is stored outside of the codebase.
- Exports the configured transporter so that it can be used in other parts of the application.

In upload.js

```
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

    console.log(info);
  } catch (error) {
    console.error(error);
  }
});
```

- This code attaches a function to the "save" event of the fileUploadSchema. This means that after a document of this schema is saved to the database, the attached function will be executed.

- Outputs the saved document to the console. This is a common practice for debugging or logging purposes. It helps you see what data was saved to the database.

- Uses the configured transporter (Nodemailer transporter) to send an email.
- The email includes information such as the sender's address, recipient's address (retrieved from the saved document's email field), subject, and content (both plain text and HTML).
- The HTML content includes a message ("Hello cloudinary image uploaded") and a link to view the uploaded image on Cloudinary.
- Catches any errors that might occur during the process of sending the email and logs the error to the console.


## must add .env file

env file data

MONGO_URL =  

PORT = 

CLOUD_NAME =  

API_KEY =  

API_SECRET = 


MAIL_HOST =  
MAIL_USER =  
MAIL_PASSWORD = 
