const kasperSrc = () => {
  if (process.env.NODE_ENV === "production") {
    return "../dist/kasper.min.js";
  }
  return "../dist/kasper.js";
};

module.exports = {
  kasperSrc: kasperSrc,
};
