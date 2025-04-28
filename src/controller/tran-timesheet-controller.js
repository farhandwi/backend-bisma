import tranTimesheetService from "../service/tran-timesheet-service.js";
import { validate } from "../validation/validation.js";
import options from "../helpers/optionTimesheet.js";
import fs from "fs";
import ejs from "ejs";
import pdf from "pdf-creator-node";
import { PDFDocument } from "pdf-lib";
import axios from "axios";
import { generateAllPdfValidation } from "../validation/tran-timesheet-validation.js";

const create = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await tranTimesheetService.create(request);
    res.status(200).json({
      status: res.statusCode,
      success: true,
      message: "Data successfully created.",
      data: result,
      url: req.protocol + "://" + req.get("host") + req.originalUrl,
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const timesheetId = req.params.timesheetId;

    await tranTimesheetService.remove(timesheetId);
    res.status(200).json({
      status: res.statusCode,
      success: true,
      message: "Data successfully deleted.",
      data: "OK",
      url: req.protocol + "://" + req.get("host") + req.originalUrl,
    });
  } catch (e) {
    next(e);
  }
};

const list = async (req, res, next) => {
  try {
    const result = await tranTimesheetService.list();
    res.status(200).json({
      status: res.statusCode,
      success: true,
      message: "Data successfully displayed.",
      data: result,
      url: req.protocol + "://" + req.get("host") + req.originalUrl,
    });
  } catch (e) {
    next(e);
  }
};

const availableStudent = async (req, res, next) => {
  try {
    const request = {
      page: req.query.page,
      nama: req.query.nama,
      nim: req.query.nim,
      prodi: req.query.prodi,
      month: req.query.month,
    };
    const result = await tranTimesheetService.availableStudent(request);
    res.status(200).json({
      status: res.statusCode,
      success: true,
      message: "Data successfully displayed.",
      data: result.data,
      paging: result.paging,
      url: req.protocol + "://" + req.get("host") + req.originalUrl,
    });
  } catch (e) {
    next(e);
  }
};

const showEdit = async (req, res, next) => {
  try {
    const timesheetId = req.params.timesheetId;
    const result = await tranTimesheetService.showEdit(timesheetId);
    res.status(200).json({
      status: res.statusCode,
      success: true,
      message: "Data successfully displayed.",
      data: result,
      url: req.protocol + "://" + req.get("host") + req.originalUrl,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const timesheetId = req.params.timesheetId;
    const request = req.body;
    request.id = timesheetId;

    const result = await tranTimesheetService.update(request);
    res.status(200).json({
      status: res.statusCode,
      success: true,
      message: "Data successfully updated.",
      data: result,
      url: req.protocol + "://" + req.get("host") + req.originalUrl,
    });
  } catch (e) {
    next(e);
  }
};

const show = async (req, res, next) => {
  try {
    const result = await tranTimesheetService.show();
    res.status(200).json({
      status: res.statusCode,
      success: true,
      message: "Data successfully displayed.",
      data: result,
      url: req.protocol + "://" + req.get("host") + req.originalUrl,
    });
  } catch (e) {
    next(e);
  }
};

const checkAvailable = async (req, res, next) => {
  try {
    const result = await tranTimesheetService.checkAvailable();
    res.status(200).json({
      status: res.statusCode,
      success: true,
      message: "Data successfully displayed.",
      data: result,
      url: req.protocol + "://" + req.get("host") + req.originalUrl,
    });
  } catch (e) {
    next(e);
  }
};

const selectAvailable = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const result = await tranTimesheetService.selectAvailable(userId);
    res.status(200).json({
      status: res.statusCode,
      success: true,
      message: "Data successfully selected.",
      data: result,
      url: req.protocol + "://" + req.get("host") + req.originalUrl,
    });
  } catch (e) {
    next(e);
  }
};

const generatePdf = async (req, res, next) => {
  try {
    const request = {
      id_pengguna: req.query.id_pengguna,
      month: req.query.month,
      project: req.query.project,
    };

    const result = await tranTimesheetService.generatePdfTimesheet(request);

    if (!result.data.error) {
      res.status(200).json({
        status: res.statusCode,
        success: true,
        message: "Data successfully selected.",
        data: result.data,
        headers: result.headers,
        total: result.total,
        masterMonth: result.masterMonth,
        weeks: result.weeks,
        url: req.protocol + "://" + req.get("host") + req.originalUrl,
      });
    } else {
      res.status(400).json({
        status: res.statusCode,
        success: false,
        message: result.data.error,
        url: req.protocol + "://" + req.get("host") + req.originalUrl,
      });
    }
  } catch (e) {
    next(e);
  }
};

const generatePdfTimesheet = async (req, res, next) => {
  try {
    const request = {
      id_pengguna: req.query.id_pengguna,
      month: req.query.month,
      project: req.query.project,
      option: req.query.option,
    };

    const result = await tranTimesheetService.generatePdfTimesheet(request);
    const templatePath = new URL("../views/timesheet.ejs", import.meta.url).pathname;
    const sanitizedTemplatePath = templatePath.replace(/^\//, "");
    const templateHtml = fs.readFileSync(sanitizedTemplatePath, "utf-8");

    const ejsRenderedHtml = ejs.render(templateHtml, { result });

    const document = {
      html: ejsRenderedHtml,
      data: { result },
      // path: "./output.pdf",
      type: "buffer",
    };
    pdf
      .create(document, options)
      .then((result) => {
        if (request.option == "lihat") {
          const base64PDF = result.toString("base64");
          const pdfDataUri = `data:application/pdf;base64,${base64PDF}`;
          res.send(pdfDataUri);
        } else if (request.option == "unduh") {
          res.setHeader("Content-Disposition", "attachment; filename=timesheet.pdf");
          res.send(result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (e) {
    next(e);
  }
};

const getAllPdf = async (req, res, next) => {
  try {
    const request = {
      month: req.query.month,
      project: req.query.project,
      option: req.query.option,
    };
    const dataPdf = await tranTimesheetService.getAllMahasiswaTimesheet(request);
    const filename = dataPdf.initialProject;

    // Fungsi untuk mengambil konten PDF dari API
    async function fetchPdfFromApi(apiUrl) {
      try {
        const response = await axios.get(apiUrl, {
          responseType: "arraybuffer", // Set responseType ke 'arraybuffer' untuk mengambil konten binary (PDF)
        });
        return response.data; // Mengembalikan konten PDF sebagai buffer
      } catch (error) {
        throw new Error("Gagal mengambil PDF dari API");
      }
    }

    let timesheetApiUrl = null,
      timesheetPdfBuffer = null,
      timesheetPdf = null,
      timesheetPages = null,
      rekapApiUrl = null,
      checkMhs = null;

    const doc = await PDFDocument.create();
    for (const data of dataPdf.data) {
      // Lokasi API yang menyediakan PDF Timesheet
      if (checkMhs != data.NIM) {
        timesheetApiUrl = `http://localhost:8000/api/generatePdfTimesheet?id_pengguna=${data.NIM}&month=${data.month}&option=unduh&project=${request.project}`;
        try {
          timesheetPdfBuffer = await fetchPdfFromApi(timesheetApiUrl);
          // Memuat halaman dari PDF Timesheet
          timesheetPdf = await PDFDocument.load(timesheetPdfBuffer);
          timesheetPages = await doc.copyPages(timesheetPdf, timesheetPdf.getPageIndices());
          for (const page of timesheetPages) {
            doc.addPage(page);
          }
        } catch (err) {
          console.error(`Error fetching or processing PDF: ${err}`);
        }
      }
      checkMhs = data.NIM;
    }

    try {
      // Lokasi API yang menyediakan PDF Rekap
      rekapApiUrl = `http://localhost:8000/api/generatePdfRecap?project=${request.project}&month=${request.month}&option=unduh`;
    } catch (error) {
      console.error(`Error fetching or processing PDF: ${error}`);
    }

    // Mengambil konten PDF dari API

    const rekapPdfBuffer = await fetchPdfFromApi(rekapApiUrl);

    // Memuat halaman dari PDF Rekap
    const rekapPdf = await PDFDocument.load(rekapPdfBuffer);
    const rekapPages = await doc.copyPages(rekapPdf, rekapPdf.getPageIndices());
    for (const page of rekapPages) {
      doc.addPage(page);
    }

    const now = new Date();
    const year = now.getFullYear();
    // const year = 2023;
    const month = request.month;

    const formattedDate = `${year}${String(month).padStart(2, "0")}`;

    const sp3Pdf = await PDFDocument.load(fs.readFileSync(`./documents/sp3/${dataPdf.initialProject}_${formattedDate}_sp3.pdf`));
    const contentSp3 = await doc.copyPages(sp3Pdf, sp3Pdf.getPageIndices());
    for (const page of contentSp3) {
      doc.addPage(page);
    }

    await doc
      .save()
      .then((result) => {
        if (request.option == "lihat") {
          const combinedPdfBuffer = Buffer.from(result);
          const base64PDF = combinedPdfBuffer.toString("base64");
          const pdfDataUri = `data:application/pdf;base64,${base64PDF}`;
          res.send(pdfDataUri);
        } else if (request.option == "unduh") {
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader("Content-Disposition", `attachment; filename=${dataPdf.initialProject}_${formattedDate}_all.pdf`);
          res.end(result);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    console.log("PDF berhasil disimpan");
  } catch (e) {
    next(e);
  }
};

export default {
  create,
  remove,
  list,
  update,
  show,
  showEdit,
  availableStudent,
  checkAvailable,
  selectAvailable,
  generatePdf,
  generatePdfTimesheet,
  getAllPdf,
};
