// const multer = require("multer");
// // const sharp = require('sharp');
// const multerS3 = require("multer-sharp-s3");
// const { v4: uuidv4 } = require("uuid");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
// const s3 = require("../utils/s3Bucket");
// const Email = require("../utils/email");
const factory = require("./handlerFactory");

//Get Unique Filenames
// const getUniqFileName = (originalname) => {
//   const name = uuidv4();
//   const ext = originalname.split(".").pop();
//   return `${name}.${ext}`;
// };

// const multerStorage3 = multerS3({
//   s3: s3,
//   ACL: "public-read",
//   Bucket: process.env.USER_UPLOADS_SB_NAME,
//   Key: (req, file, cb) => {
//     const fileName = getUniqFileName(file.originalname);
//     const s3InnerDirectory = "kyc";
//     const finalPath = `${s3InnerDirectory}/${fileName}`;

//     file.newName = fileName;

//     cb(null, finalPath);
//   },
//   resize: {
//     width: 500,
//     height: 500,
//   },
//   toFormat: {
//     type: "jpeg",
//     options: {
//       progressive: true,
//       quality: 90,
//     },
//   },
// });

// const upload = multer({
//   storage: multerStorage3,
// });

// exports.uploadUserDocs = upload.array("doc", 3);
// exports.uploadUserPhoto = upload.single("photo");

// exports.uploadUserKyc = upload.fields([
//   { name: "doc1", maxCount: 1 },
//   { name: "doc2", maxCount: 1 },
// ]);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data

  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = JSON.parse(req.body.payload);
  if (req.files) {
    const [doc1, doc2, doc3] = req.files.map((file) => file.Location);
    filteredBody.photo = doc1;
    filteredBody.passport = doc2;
    filteredBody.kra = doc3;
  }

  if (req.file) {
    //console.log(req.file);
    filteredBody.photo = req.file.Location;
  }

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  // const url = `${process.env.FRONTEND_URL}/login`;
  // await new Email(updatedUser, url).sendKycStatus();

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  let userImage = null;
  if (req.file) userImage = req.file.Location;
  //console.log(req.file);

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { photo: userImage },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.updatedevicelocation = catchAsync(async (req, res, next) => {
  const device = req.params;

  // 3) Update user document

  res.status(200).json({
    status: `success you have updated device ${device}`,
  });
});

exports.updateKyc = catchAsync(async (req, res, next) => {
  const userId = req.user._id.toString();

  const { user } = req;

  const { doc1, doc2 } = req.files;
  // logo: logo[0].location,
  //   doc: doc[0].location,
  user.passport = doc1[0].Location;
  user.kra = doc2[0].Location;
  user.kycStatus = "pending";

  const doc = await User.findByIdAndUpdate(userId, user, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }

  // const url = `${process.env.FRONTEND_URL}/login`;
  // // send kyc status email
  // await new Email(doc, url).sendKycStatusPending();

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
      files: req.files,
      condition: !!req.files,
    },
  });
});

exports.searchBusiness = catchAsync(async (req, res, next) => {
  const searchTerm = req.query.term; //
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const business = await User.find({
    $or: [
      { businessName: { $regex: searchTerm, $options: "i" } },
      { fullName: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
      { location: { $regex: searchTerm, $options: "i" } },
      { userName: { $regex: searchTerm, $options: "i" } },
    ],
  });
  const count = business.length;

  res.status(200).json({
    status: "success",
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalRecords: count,
    data: { business },
  });
});

exports.filterBusiness = catchAsync(async (req, res, next) => {
  const filterField = req.query.field;
  const filtervalue = req.query.value;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const business = await User.find({
    $and: [{ [filterField]: filtervalue }, { role: "business" }],
  });
  const count = business.length;

  res.status(200).json({
    status: "success",
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalRecords: count,
    data: { business },
  });
});

exports.filterExplorer = catchAsync(async (req, res, next) => {
  const filterField = req.query.field;
  const filtervalue = req.query.value;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const business = await User.find({
    $and: [{ role: "explorer" }, { [filterField]: filtervalue }],
  });

  const count = business.length;

  res.status(200).json({
    status: "success",
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalRecords: count,
    data: { business },
  });
});

exports.searchBusinessByDate = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const business = await User.find({
    from: { $lte: new Date(endDate) }, // Records with "from" date less than or equal to the end date
    to: { $gte: new Date(startDate) }, // Records with "to" date greater than or equal to the start date
  });
  res.status(200).json({
    status: "success",
    totalRecords: business.length,
    data: { business },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
// exports.updateUser = factory.updateOne(User);

exports.updateUser = catchAsync(async (req, res, next) => {
  const doc = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }

  if (req.body.kycStatus) {
    if (req.body.kycStatus === "approved") {
      // const url = `${process.env.FRONTEND_URL}/business`;
      // await new Email(doc, url).sendKycStatusApproved();
    }
    if (req.body.kycStatus === "cancelled") {
      // const url = `${process.env.FRONTEND_URL}/business`;
      // // await new Email(doc, url).sendKycStatusCancelled();
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

exports.deleteUser = factory.deleteOne(User);
