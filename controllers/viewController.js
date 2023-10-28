exports.getOverview = (req, res, next) => {
  res.json({
    message: "welcome to scode",
    author: "Joseph Maina",
    year: "2023",
    for: "Scode admin",
  });
};
