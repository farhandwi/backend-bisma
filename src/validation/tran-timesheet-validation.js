import Joi from "joi";

const createTranTimesheetValidation = Joi.array().items(
  Joi.object({
    id_kategori_kegiatan: Joi.number().positive().optional(),
    id_tran_project: Joi.number().positive().optional(),
    tanggal: Joi.date().required(),
    jam_mulai: Joi.string().required(),
    jam_selesai: Joi.string().required(),
    deskripsi: Joi.string().max(500).required(),
    total_sesi: Joi.number().min(0).max(40).precision(2).required(),
  })
);

const updateTranTimesheetValidation = Joi.object({
  id: Joi.number().positive().required(),
  jam_mulai: Joi.string().required(),
  jam_selesai: Joi.string().required(),
  deskripsi: Joi.string().max(500).required(),
  total_sesi: Joi.number().min(0).max(40).precision(2).required(),
});

const getId = Joi.number().positive().required();

const getNIM = Joi.string().max(50).required();

const showAvailableTranTimesheetValidation = Joi.object({
  nama: Joi.string().max(40).optional(),
  nim: Joi.string().max(40).optional(),
  month: Joi.number().positive().min(1).max(12).optional(),
  prodi: Joi.string().max(40).optional(),
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(15),
});

const getDataPdfTimesheetValidation = Joi.object({
  id_pengguna: Joi.string().max(50).required(),
  month: Joi.number().positive().max(12).required(),
  project: Joi.string().max(50).required(),
});

const generatePdfTimesheetValidation = Joi.object({
  id_pengguna: Joi.string().max(50).required(),
  month: Joi.number().positive().max(12).required(),
  project: Joi.string().max(50).required(),
  option: Joi.string().max(50).required(),
});

const generateAllPdfValidation = Joi.object({
  month: Joi.number().positive().max(12).required(),
  project: Joi.string().max(50).optional(),
  option: Joi.string().max(50).required(),
});

export { createTranTimesheetValidation, updateTranTimesheetValidation, showAvailableTranTimesheetValidation, getId, getNIM, generatePdfTimesheetValidation, generateAllPdfValidation, getDataPdfTimesheetValidation };
