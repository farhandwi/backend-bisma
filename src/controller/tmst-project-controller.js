import { logger } from "../application/logging.js";
import tmstProjectService from "../service/tmst-project-service.js";

const create = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await tmstProjectService.create(request);
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

    await tmstProjectService.remove(projectId);
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
    const request = {
      namaProjek: req.query.namaProjek,
      page: req.query.page,
    };
    const result = await tmstProjectService.list(request);
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

const update = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const request = req.body;
    request.id = projectId;

    const result = await tmstProjectService.update(request);
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

const select = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const result = await tmstProjectService.select(projectId);
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

const showAvailableStudent = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const result = await tmstProjectService.showAvailableStudent(userId);
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

export default {
  create,
  remove,
  list,
  update,
  select,
  showAvailableStudent,
};
