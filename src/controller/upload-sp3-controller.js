import multer from "multer";
import path from "path";
import tmstProjectService from "../service/tmst-project-service.js";

// Konfigurasi multer untuk menyimpan file di direktori "uploads"
const storageConfig = (result) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "documents/sp3");
    },
    filename: (req, file, cb) => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const formattedDate = `${year}${String(month).padStart(2, "0")}`;

      const safeFileName = result.inisial_project + "_" + formattedDate + "_" + "sp3" + ".pdf";

      cb(null, safeFileName);
    },
  });
};

const controllerUploadSp3 = async (req, res, next) => {
  try {
    const idProject = req.params.id;
    const result = await tmstProjectService.select(idProject);
    const storage = storageConfig(result);

    const upload = multer({ storage: storage }).single("pdfFile");

    upload(req, res, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Terjadi kesalahan saat mengunggah file.");
      }
      res.json({ message: "File uploaded successfully!" });
    });
  } catch (e) {
    next(e);
  }
};

export default {
  controllerUploadSp3,
};
