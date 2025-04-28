import incentiveService from "../service/tran-incentive-service.js";

const create = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await incentiveService.create(request);
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

const list = async (req, res, next) => {
  try {
    const request = {
      kategori: req.query.kategori,
      insentif: req.query.insentif,
      page: req.query.page,
    };
    const result = await incentiveService.list(request);
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

const read = async (req, res, next) => {
  try {
    const result = await incentiveService.read();
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
    const incentiveId = req.params.incentiveId;
    const request = req.body;
    request.id = incentiveId;

    const result = await incentiveService.update(request);
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

const remove = async (req, res, next) => {
  try {
    const incentiveId = req.params.incentiveId;

    await incentiveService.remove(incentiveId);
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

const select = async (req, res, next) => {
  try {
    const incentiveId = req.params.incentiveId;
    const result = await incentiveService.select(incentiveId);
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
  list,
  read,
  update,
  remove,
  select,
};
