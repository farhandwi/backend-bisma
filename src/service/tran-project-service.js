import { validate } from "../validation/validation.js";
import { createTranProjectValidation, deleteTranProjectValidation, updateTranProjectValidation, recapValidation, getAvailableProjectById, getDataRecapValidation } from "../validation/tran-project-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import moments from "moment";
import { format } from "path";
import { error } from "console";

const create = async (request) => {
  const project = validate(createTranProjectValidation, request);
  let validateIdProject = null;
  let validateIdUser = null;
  let validateId = null;

  async function validateAndProcessData() {
    for (const data of project) {
      validateIdProject = await prismaClient.tmst_project.count({
        where: {
          id: data.id_project,
        },
      });
      if (validateIdProject === 0) {
        break;
      }

      validateIdUser = await prismaClient.tmst_pengguna.count({
        where: {
          id: data.id_peserta,
        },
      });

      if (validateIdUser === 0) {
        break;
      }

      validateId = await prismaClient.tran_project.count({
        where: {
          id_peserta: data.id_peserta,
          id_project: data.id_project,
        },
      });
      if (validateId >= 1) {
        break;
      }
    }
  }
  await validateAndProcessData();

  if (validateIdProject === 0) {
    throw new ResponseError(400, "Project is not found!");
  } else if (validateIdUser === 0) {
    throw new ResponseError(400, "User is not found!");
  }

  const createProject = prismaClient.tran_project.createMany({
    data: project,
  });

  return createProject;
};

const remove = async (projectId) => {
  projectId = validate(deleteTranProjectValidation, projectId);

  const totalInDatabase = await prismaClient.tran_project.count({
    where: {
      id: projectId,
    },
  });

  if (totalInDatabase !== 1) {
    throw new ResponseError(404, "Project is not found");
  }

  return prismaClient.tran_project.delete({
    where: {
      id: projectId,
    },
  });
};

const list = async () => {
  const getProject = await prismaClient.tran_project.findMany({
    select: {
      id: true,
      id_project: true,
      id_peserta: true,
      estimasi: true,
    },
  });
  return getProject;
};

const update = async (request) => {
  const project = validate(updateTranProjectValidation, request);
  const totalProjectInDatabase = await prismaClient.tran_project.count({
    where: {
      id: project.id,
    },
  });

  if (totalProjectInDatabase !== 1) {
    throw new ResponseError(404, "Project is not found");
  }

  return prismaClient.tran_project.update({
    where: {
      id: project.id,
    },
    data: {
      id_project: project.id_project,
      id_peserta: project.id_peserta,
      estimasi: project.estimasi,
    },
    select: {
      id_project: true,
      id_peserta: true,
      estimasi: true,
    },
  });
};

const get = async (request) => {
  const id_peserta = validate(getAvailableProjectById, request);
  const checkId = await prismaClient.tmst_pengguna.findFirst({
    where: {
      id: id_peserta,
    },
  });

  if (!checkId) {
    throw new ResponseError(404, "User Id Not found!");
  }
  const result = await prismaClient.tran_project.findMany({
    select: {
      tmst_project: {
        select: {
          id: true,
          nama: true,
          tmst_kategori_magang: {
            select: {
              kategori: true,
              tran_insentif: {
                select: {
                  durasi_satuan: true,
                  besaran_insentif: true,
                },
              },
            },
          },
          tmst_pengguna: {
            select: {
              nama: true,
            },
          },
        },
      },
    },
    where: {
      id_peserta: id_peserta,
    },
  });

  result.forEach((data) => {
    let id = data.tmst_project.id;
    let nama_project = data.tmst_project.nama;
    let kategori = data.tmst_project.tmst_kategori_magang.kategori;
    let durasi_satuan = data.tmst_project.tmst_kategori_magang.tran_insentif.durasi_satuan;
    let besaran_insentif = data.tmst_project.tmst_kategori_magang.tran_insentif.besaran_insentif;
    let pic = data.tmst_project.tmst_pengguna.nama;
    delete data.tmst_project;
    data.id = id;
    data.nama_project = nama_project;
    data.kategori = kategori;
    data.durasi_satuan = durasi_satuan;
    data.besaran_insentif = besaran_insentif;
    data.pic = pic;
    id = null;
    nama_project = null;
    kategori = null;
    besaran_insentif = null;
    durasi_satuan = null;
    pic = null;
  });

  return result;
};

const recapPdf = async (request) => {
  let validatePdf = null;

  if (!request.option) {
    validatePdf = validate(getDataRecapValidation, request);
  } else if (request.option) {
    validatePdf = validate(recapValidation, request);
  }

  const checkProject = await prismaClient.tmst_project.findFirst({
    where: {
      nama: validatePdf.project,
    },
  });

  if (!checkProject) {
    return {
      data: { error: "Project Is Not Found!" },
    };
  }

  const checkTimesheet = await prismaClient.tran_timesheet.findFirst({
    where: {
      AND: [
        { tanggal: { gte: new Date(`2023-${validatePdf.month}-01`) } }, // Mulai dari awal month
        { tanggal: { lt: new Date(`2023-${validatePdf.month + 1}-01`) } }, // Sebelum awal month berikutnya
      ],
      tran_project: {
        tmst_project: {
          nama: validatePdf.project,
        },
      },
    },
  });

  if (!checkTimesheet) {
    return {
      data: { error: "Timesheet empty" },
    };
  }

  const dataPdf = await prismaClient.tran_project.findMany({
    select: {
      tran_timesheet: {
        select: {
          jam_mulai: true,
          jam_selesai: true,
          tanggal: true,
          total_sesi: true,
        },
        where: {
          tanggal: {
            gte: new Date(`2023-${validatePdf.month}-01`),
            lt: new Date(`2023-${validatePdf.month + 1}-01`),
          },
        },
      },
      tmst_project: {
        select: {
          nama: true,
          inisial_project: true,
          tmst_kategori_magang: {
            select: {
              tran_insentif: {
                select: {
                  besaran_insentif: true,
                },
              },
            },
          },
        },
      },
      tmst_pengguna: {
        select: {
          id: true,
          nama: true,
        },
      },
    },
    where: {
      tran_timesheet: {
        some: {
          tanggal: {
            gte: new Date(`2023-${validatePdf.month}-01`),
            lt: new Date(`2023-${validatePdf.month + 1}-01`),
          },
        },
      },
      tmst_project: {
        nama: validatePdf.project,
      },
    },
  });

  let jam_mulai = [];
  let jam_selesai = [];
  let tanggal = [];
  let sesi = [];
  let nama_project = null;
  let besaran_insentif = null;
  let total_sesi = 0;
  let total_insentif = null;
  let total_jam = 0;
  let jam = [];
  let nama = null;
  let nim = null;
  let biodata = null;
  let headers = ["Nama Mahasiswa"];
  let master_total_jam = 0;
  let master_total_sesi = 0;
  let master_total_insentif = 0;
  let year = null,
    month = null,
    day = null;
  let formattedDate = null;
  let inisial_project = null;

  dataPdf.forEach((data) => {
    let countTime = 0;
    data.tran_timesheet.forEach((timesheetData) => {
      if (data.tran_timesheet.length != null) {
        jam_mulai.push(timesheetData.jam_mulai);
        jam_selesai.push(timesheetData.jam_selesai);
        sesi.push(timesheetData.total_sesi);
        year = timesheetData.tanggal.getFullYear();
        month = timesheetData.tanggal.getMonth() + 1;
        day = timesheetData.tanggal.getDate();
        formattedDate = `${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}`;
        tanggal.push(formattedDate);
      }
      countTime++;
    });
    for (let i = 0; i <= countTime - 1; i++) {
      //menghitung total jam
      const startTimeObj = moments(jam_mulai[i], "YYYY-MM-DDTHH:mm:ss");
      const endTimeObj = moments(jam_selesai[i], "YYYY-MM-DDTHH:mm:ss");

      const diffInMilliseconds = endTimeObj.diff(startTimeObj);
      const diffInHours = moments.duration(diffInMilliseconds).asHours();

      jam.push(Math.floor(diffInHours));
    }
    tanggal.forEach((tgl) => {
      let count = 0;
      if (headers.length === 0) {
        headers.push(tgl);
      } else {
        headers.forEach((head) => {
          if (tgl === head) {
            count++;
          }
        });
        if (count === 0) {
          headers.push(tgl);
        }
      }
    });
    total_jam += jam.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    master_total_jam += total_jam;
    total_sesi += sesi.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    master_total_sesi += total_sesi;
    nama_project = data.tmst_project.nama;
    inisial_project = data.tmst_project.inisial_project;
    besaran_insentif = data.tmst_project.tmst_kategori_magang.tran_insentif.besaran_insentif;
    total_insentif = total_sesi * besaran_insentif;
    master_total_insentif += total_insentif;
    nama = data.tmst_pengguna.nama;
    nim = data.tmst_pengguna.id;
    biodata = nama + " | " + nim;
    data.total_sesi = Math.floor(total_sesi);
    data.tanggal = tanggal;
    data.nama_project = nama_project;
    data.inisial_project = inisial_project;
    data.besaran_insentif = besaran_insentif;
    data.total_insentif = total_insentif;
    data.jam = jam;
    data.total_jam = Math.floor(total_jam);
    data.biodata = biodata;
    data.month = validatePdf.month;
    delete data.tran_timesheet;
    delete data.tmst_project;
    delete data.tmst_pengguna;
    jam_mulai = [];
    jam_selesai = [];
    tanggal = [];
    total_sesi = 0;
    total_jam = 0;
    jam = [];
    sesi = [];
  });

  headers.push("Total Jam");
  headers.push("Total Sesi");
  headers.push("Total Insentif");
  const total = { total_jam: master_total_jam, total_sesi: master_total_sesi, total_insentif: master_total_insentif };

  let masterMonth = null;
  if (dataPdf.length !== 0) {
    const dataDate = dataPdf[0].tanggal[0];
    const date = new Date(dataDate);

    date.setMonth(date.getMonth() + 1);

    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();

    // Format tanggal dalam bentuk "YYYY-MM-DD"
    const newTanggal = `${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}`;

    const monthYear1 = new Date(dataDate);

    // Daftar nama month dalam bahasa Inggris
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    let monthIndex = monthYear1.getMonth();
    let monthName = monthNames[monthIndex];
    let getyear = monthYear1.getFullYear();

    const startMonth = `${monthName} ${getyear}`;

    const monthYear2 = new Date(newTanggal);

    monthIndex = monthYear2.getMonth();
    monthName = monthNames[monthIndex];
    getyear = monthYear2.getFullYear();

    const finishMonth = `${monthName} ${year}`;
    masterMonth = {
      startMonth,
      finishMonth,
    };
  }

  return {
    data: dataPdf,
    total: total,
    headers: headers,
    month: masterMonth,
  };
};

const detailAvailableStudent = async (request) => {
  const id_peserta = validate(getAvailableProjectById, request);
  const checkId = await prismaClient.tmst_pengguna.findFirst({
    where: {
      id: id_peserta,
    },
  });

  if (!checkId) {
    throw new ResponseError(404, "User Id Not found!");
  }

  const data_available = await prismaClient.tran_project.findMany({
    select: {
      tmst_project: {
        select: {
          tanggal_mulai: true,
          tanggal_selesai: true,
          nama: true,
          tmst_kategori_magang: {
            select: {
              kategori: true,
            },
          },
          tmst_pengguna: {
            select: {
              departemen: true,
            },
          },
        },
      },
      tran_timesheet: {
        select: {
          total_sesi: true,
        },
      },
    },
    where: {
      id_peserta: id_peserta,
    },
  });

  let tanggal_mulai = null;
  let tanggal_selesai = null;
  let nama_kategori_magang = null;
  let nama_project = null;
  let departemen_pic = null;
  let sesi = [];
  let total_sesi = null;

  data_available.forEach((data) => {
    data.tran_timesheet.forEach((data) => {
      sesi.push(data.total_sesi);
    });
    total_sesi = sesi.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    tanggal_mulai = data.tmst_project.tanggal_mulai;
    tanggal_selesai = data.tmst_project.tanggal_selesai;
    nama_kategori_magang = data.tmst_project.tmst_kategori_magang.kategori;
    nama_project = data.tmst_project.nama;
    departemen_pic = data.tmst_project.tmst_pengguna.departemen;
    data.nama_kategori_magang = nama_kategori_magang;
    data.tanggal_mulai = tanggal_mulai;
    data.tanggal_selesai = tanggal_selesai;
    data.nama_project = nama_project;
    data.total_sesi = total_sesi;
    delete data.tran_timesheet;
    delete data.tmst_project;
    total_sesi = null;
    sesi = [];
    tanggal_mulai = null;
    tanggal_selesai = null;
    nama_kategori_magang = null;
    nama_project = null;
    departemen_pic = null;
  });

  return data_available;
};

const getOne = async (request) => {
  request = validate(deleteTranProjectValidation, request);
  const data = await prismaClient.tran_project.findMany({
    select: {
      id: true,
      id_peserta: true,
      id_project: true,
      estimasi: true,
      durasi: true,
    },
    where: {
      tmst_project: {
        id: request,
      },
    },
  });
  return data;
};

export default {
  create,
  remove,
  list,
  update,
  recapPdf,
  detailAvailableStudent,
  get,
  getOne,
};
