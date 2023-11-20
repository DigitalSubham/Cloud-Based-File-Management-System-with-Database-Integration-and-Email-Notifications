const FILEUPLOAD = require("../models/upload");
const cloudinary = require("cloudinary").v2;

//This controller will take file from client and upload on server on specific path

const localUpload = async (req, res) => {
  //   console.log(req);
  try {
    //fetch file
    const file = req.files.file;
    console.log("file", file);

    let path =
      __dirname + "/files/" + Date.now() + `.${file.name.split(".")[1]}`;
    file.mv(path, (err) => {
      console.log("err", err);
    });
    res.json({ success: true, message: "local file upload successfully" });
  } catch (error) {
    console.log("not able to upload file of server");
    console.log(error);
  }
};

function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder, quality) {
  const options = { folder };
  if (quality) {
    options.quality = quality;
  }
  options.resource_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

//image upload to cloudinary and entry to db
const imageUpload = async (req, res) => {
  try {
    const { name, tags, email } = req.body;

    const file = req.files.imageFile;
    // console.log(file);

    const supportedTypes = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".")[1].toLowerCase();
    // console.log("fileType", fileType);

    //is file supported check
    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "file type not supported",
      });
    }

    //upload file to cloudinary
    const response = await uploadFileToCloudinary(file, "fileUpload");
    // console.log("response from cloudinary", response);

    // save entry to db
    const fileData = await FILEUPLOAD.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });

    res.json({
      success: true,
      imageUrl: response.secure_url,
      message: "image uploaded to cloudinary successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "something wait wrong",
    });
  }
};

const videoUpload = async (req, res) => {
  try {
    //data fetch

    const { name, email, tags } = req.body;
    const file = req.files.videoFile;
    // console.log(file);

    const supportedTypes = ["mp4", "mov"];
    const fileType = file.name.split(".")[1].toLowerCase();
    // console.log("fileType", fileType);

    //is file supported check
    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "file type not supported",
      });
    }

    //upload file to cloudinary
    const response = await uploadFileToCloudinary(file, "fileUpload");
    // console.log("response from cloudinary", response);

    // save entry to db
    const fileData = await FILEUPLOAD.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });

    res.json({
      success: true,
      imageUrl: response.secure_url,
      message: "video uploaded to cloudinary successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "something wait wrong",
    });
  }
};

//image reducer

const imageReducer = async (req, res) => {
  try {
    const { name, tags, email } = req.body;

    const file = req.files.imageReducer;
    // console.log(file);

    const supportedTypes = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".")[1].toLowerCase();
    // console.log("fileType", fileType);

    //is file supported check
    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "file type not supported",
      });
    }

    //upload file to cloudinary
    const response = await uploadFileToCloudinary(file, "fileUpload", 30);
    console.log("response from cloudinary", response);

    // save entry to db
    const fileData = await FILEUPLOAD.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });

    res.json({
      success: true,
      imageUrl: response.secure_url,
      message: "image uploaded to cloudinary successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "something wait wrong",
    });
  }
};

// must to today validation in videoUpload controller to check size of video not more that 10mb
// in imageReducer controller reduce image size by reducing height

module.exports = { localUpload, imageUpload, videoUpload, imageReducer };
