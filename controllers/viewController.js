exports.getOverview = (req, res, next) => {
  res.json({
    message: "Awesome Ziara web server works! 😎",
    author: "Joseph Maina",
    year: "2023",
    for: "Scode admin",
  });
};
