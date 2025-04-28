import Joi from "joi";

const createPaymentValidation = Joi.object({
  id_tran_project: Joi.number().positive().required(),
  periode: Joi.number().positive().required(),
  total_tagihan: Joi.number().positive().optional(),
  url_file_sp3: Joi.string().max(100).required(),
  id_status: Joi.number().positive().required(),
});

const UpdatePaymentValidation = Joi.object({
  id: Joi.number().positive().required(),
  id_tran_project: Joi.number().positive().required(),
  periode: Joi.number().positive().required(),
  total_tagihan: Joi.number().positive().optional(),
  url_file_sp3: Joi.string().max(100).required(),
  id_status: Joi.number().positive().required(),
});

const listAdminValidation = Joi.object({
  namaProjek: Joi.string().max(255).optional(),
  size: Joi.number().min(1).positive().max(100).default(5),
  page: Joi.number().min(1).positive().default(1),
  status: Joi.string().max(10).required(),
});

const showSp3Validation = Joi.object({
  idProject: Joi.number().min(1).positive().required(),
  month: Joi.number().min(1).positive().max(12).required(),
  option: Joi.string().max(255).required(),
});

const deletePaymentValidation = Joi.number().positive().required();

export { createPaymentValidation, UpdatePaymentValidation, deletePaymentValidation, listAdminValidation, showSp3Validation };
