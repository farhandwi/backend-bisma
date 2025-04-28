import Joi from "joi";

const createAndUpdateValidation = Joi.object({
  id: Joi.number().positive().optional(),
  id_kategori: Joi.number().positive().required(),
  nama: Joi.string().max(50).required(),
  pic: Joi.string().max(50).required(),
  tanggal_mulai: Joi.date().required(),
  tanggal_selesai: Joi.date().required(),
});

const listProjectValidation = Joi.object({
  namaProjek: Joi.string().max(255).optional(),
  size: Joi.number().min(1).positive().max(100).default(15),
  page: Joi.number().min(1).positive().default(1),
});

const tmstProjectId = Joi.number().positive().required();

const showAvailableStudentValidation = Joi.string().max(50).required();

export { createAndUpdateValidation, tmstProjectId, showAvailableStudentValidation, listProjectValidation };
