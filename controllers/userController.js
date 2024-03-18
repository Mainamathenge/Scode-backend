const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

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

exports.updateUser = catchAsync(async (req, res, next) => {
  const doc = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

exports.updatedevicelocation = catchAsync(async (req, res, next) => {
  const device = req.query;
  console.log(device);
  console.log(`device id ${device.deviceid} device status 
  ${device.status}  device energy ${device.energy}  device location ${device.location} `);

  if (device.status === "off") {
    res.status(200).json({
      message: "device is off",
      status: false,
    });
  } else {
    res.status(200).json({
      message: `success you have updated device ${device.id}`,
      status: true,
    });
  }
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
