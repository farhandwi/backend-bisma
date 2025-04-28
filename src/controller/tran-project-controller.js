import tranProjectService from "../service/tran-project-service.js";
import options from "../helpers/optionsRekap.js";
import path from "path";
import fs from "fs";
import ejs from "ejs";
import pdf from "pdf-creator-node";

const create = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await tranProjectService.create(request);
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
    const projectId = req.params.projectId;

    await tranProjectService.remove(projectId);
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
    const result = await tranProjectService.list();
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
    const projectId = req.params.projectId;
    const request = req.body;
    request.id = projectId;

    const result = await tranProjectService.update(request);
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

const get = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const result = await tranProjectService.get(userId);
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

const generatePdf = async (req, res, next) => {
  try {
    const request = {
      project: req.query.project,
      month: req.query.month,
    };

    const result = await tranProjectService.recapPdf(request);

    if (!result.data.error) {
      res.status(200).json({
        status: res.statusCode,
        success: true,
        message: "Data successfully selected.",
        data: result.data,
        headers: result.headers,
        total: result.total,
        month: result.month,
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

const recapPdf = async (req, res, next) => {
  try {
    const request = {
      project: req.query.project,
      month: req.query.month,
      option: req.query.option,
    };

    const result = await tranProjectService.recapPdf(request);
    const templatePath = new URL("../views/rekap.ejs", import.meta.url).pathname;
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
          res.setHeader("Content-Disposition", "attachment; filename=rekap.pdf");
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

const detailAvailableStudent = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const result = await tranProjectService.detailAvailableStudent(userId);
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

const getOne = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const result = await tranProjectService.getOne(projectId);
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

export default {
  create,
  remove,
  list,
  update,
  get,
  generatePdf,
  detailAvailableStudent,
  recapPdf,
  getOne,
};
