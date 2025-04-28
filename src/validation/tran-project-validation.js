import Joi from "joi";

const createTranProjectValidation = Joi.array().items(
  Joi.object({
    id_project: Joi.number().positive().required(),
    id_peserta: Joi.string().max(50).required(),
    estimasi: Joi.number().positive().required(),
    durasi: Joi.number().positive().required(),
  })
);

const updateTranProjectValidation = Joi.object({
  id: Joi.number().positive().required(),
  id_project: Joi.number().positive().required(),
  id_peserta: Joi.string().max(50).required(),
  estimasi: Joi.number().positive().required(),
});

const getAvailableProjectById = Joi.string().max(50).required();

const getDataRecapValidation = Joi.object({
  project: Joi.string().max(50).required(),
  month: Joi.number().positive().max(12).required(),
});

const recapValidation = Joi.object({
  project: Joi.string().max(50).required(),
  month: Joi.number().positive().max(12).required(),
  option: Joi.string().max(50).required(),
});

const deleteTranProjectValidation = Joi.number().positive().required();

export { createTranProjectValidation, deleteTranProjectValidation, updateTranProjectValidation, recapValidation, getAvailableProjectById, getDataRecapValidation };
