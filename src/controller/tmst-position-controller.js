import tmstPositionService from "../service/tmst-position-service.js";

const create = async (req, res, next) => {
  try {
    const request = req.body;
    const result = await tmstPositionService.create(request);
    res.status(200).json({
      status: res.statusCode,
      success: true,
      message: "Data Successfully created.",
      data: result,
      url: req.protocol + "://" + req.get("host") + req.originalUrl,
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const positionId = req.params.positionId;
    await tmstPositionService.remove(positionId);
    res.status(200).json({
      status: res.statusCode,
      success: true,
      message: "Data Successfully deleted.",
      data: "OK",
      url: req.protocol + "://" + req.get("host") + req.originalUrl,
    });
  } catch (e) {
    next(e);
  }
};

const list = async (req, res, next) => {
  try {
    const result = await tmstPositionService.list();
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
    const positionId = req.params.positionId;
    const request = req.body;
    request.id = positionId;

    const result = await tmstPositionService.update(request);
    res.status(200).json({
      status: res.statusCode,
      success: true,
      message: "Data successfully Updated.",
      data: result,
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
};
