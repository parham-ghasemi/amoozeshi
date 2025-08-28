const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadPath = path.join(process.cwd(), "uploads", "resume");

// Ensure upload folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer config – only PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, "resume.pdf"), // always overwrite
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF files are allowed!"), false);
};

exports.upload = multer({ storage, fileFilter });

// Controller: upload resume
exports.uploadResume = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ message: "Resume uploaded successfully" });
};

// Controller: get resume
exports.getResume = (req, res) => {
  const filePath = path.join(uploadPath, "resume.pdf");
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "No resume found" });
  }
  res.sendFile(filePath);
};
