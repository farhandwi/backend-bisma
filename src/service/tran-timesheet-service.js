import { validate } from "../validation/validation.js";
import {
  createTranTimesheetValidation,
  getId,
  getNIM,
  showAvailableTranTimesheetValidation,
  updateTranTimesheetValidation,
  generatePdfTimesheetValidation,
  getDataPdfTimesheetValidation,
  generateAllPdfValidation,
} from "../validation/tran-timesheet-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { eachWeekOfInterval, startOfWeek, endOfWeek, format, startOfMonth, endOfMonth } from "date-fns";

const create = async (request) => {
  const timesheet = validate(createTranTimesheetValidation, request);

  let validateActivity = null;
  let validateProject = null;

  async function validateAndProcessData() {
    for (const data of timesheet) {
      validateActivity = await prismaClient.tmst_kategori_kegiatan.count({
        where: {
          id: data.id_kategori_kegiatan,
        },
      });

      if (validateActivity === 0) {
        break;
      }

      validateProject = await prismaClient.tran_project.count({
        where: {
          id: data.id_tran_project,
        },
      });

      if (validateProject === 0) {
        break;
      }
    }
  }

  await validateAndProcessData();

  if (validateActivity === 0) {
    throw new ResponseError(400, "Activity is not found!");
  } else if (validateProject === 0) {
    throw new ResponseError(400, "Project is not found!");
  }
  return prismaClient.tran_timesheet.createMany({
    data: timesheet,
  });
};

const remove = async (timesheetId) => {
  timesheetId = validate(getId, timesheetId);

  const totalInDatabase = await prismaClient.tran_timesheet.count({
    where: {
      id: timesheetId,
    },
  });

  if (totalInDatabase !== 1) {
    throw new ResponseError(404, "Timesheet is not found");
  }

  return prismaClient.tran_timesheet.delete({
    where: {
      id: timesheetId,
    },
  });
};

const list = async () => {
  const getTimesheet = await prismaClient.tran_timesheet.findMany({
    select: {
      id: true,
      id_kategori_kegiatan: true,
      id_tran_project: true,
      tanggal: true,
      jam_mulai: true,
      jam_selesai: true,
      deskripsi: true,
      total_sesi: true,
    },
  });
  return getTimesheet;
};

const update = async (request) => {
  const timesheet = validate(updateTranTimesheetValidation, request);
  const totalTimesheetInDatabase = await prismaClient.tran_timesheet.count({
    where: {
      id: timesheet.id,
    },
  });

  if (totalTimesheetInDatabase !== 1) {
    throw new ResponseError(404, "Timesheet is not found");
  }

  // const startTimeObj = moments(timesheet.jam_mulai, "YYYY-MM-DDTHH:mm:ss");
  // const endTimeObj = moments(timesheet.jam_selesai, "YYYY-MM-DDTHH:mm:ss");

  // const diffInMilliseconds = endTimeObj.diff(startTimeObj);
  // const diffInHours = moments.duration(diffInMilliseconds).asHours();

  return prismaClient.tran_timesheet.update({
    where: {
      id: timesheet.id,
    },
    data: {
      id_kategori_kegiatan: timesheet.tmst_kategori_kegiatan,
      jam_mulai: timesheet.jam_mulai,
      jam_selesai: timesheet.jam_selesai,
      deskripsi: timesheet.deskripsi,
      total_sesi: timesheet.diffInHours,
    },
    select: {
      id_kategori_kegiatan: true,
      id_tran_project: true,
      tanggal: true,
      jam_mulai: true,
      jam_selesai: true,
      deskripsi: true,
      total_sesi: true,
    },
  });
};

const show = async () => {
  let nama_project = null;
  let pic = null;
  let kategori = null;
  const data = await prismaClient.tran_timesheet.findMany({
    select: {
      id: true,
      tanggal: true,
      jam_mulai: true,
      jam_selesai: true,
      deskripsi: true,
      total_sesi: true,
      tran_project: {
        select: {
          tmst_project: {
            select: {
              nama: true,
              tmst_pengguna: {
                select: {
                  nama: true,
                },
              },
              tmst_kategori_magang: {
                select: {
                  kategori: true,
                },
              },
            },
          },
        },
      },
    },
    where: {
      tran_project: {
        id_peserta: "105221036",
      },
    },
  });

  data.forEach((data) => {
    nama_project = data.tran_project.tmst_project.nama;
    pic = data.tran_project.tmst_project.tmst_pengguna.nama;
    kategori = data.tran_project.tmst_project.tmst_kategori_magang.kategori;
    delete data.tran_project;
    data.nama_project = nama_project;
    data.nama = pic;
    data.kategori = kategori;
    nama_project = null;
    pic = null;
    kategori = null;
  });

  return data;
};

const availableStudent = async (request) => {
  request = validate(showAvailableTranTimesheetValidation, request);
  const skip = (request.page - 1) * request.size;
  if (!request.month) {
    const date = new Date();
    const month = date.getMonth() + 1;
    request.month = month;
  }
  if (!request.nama) {
    request.nama = "";
  }
  if (!request.nim) {
    request.nim = "";
  }
  if (!request.prodi) {
    request.prodi = "";
  }

  const countRaw = await prismaClient.$queryRaw`
  SELECT COUNT(*) AS total_rows
FROM (
  select tmst_pengguna.departemen, tmst_pengguna.nama, tmst_pengguna.id, sum(tran_timesheet.total_sesi) as sisa_sesi, tmst_pengguna.no_telp from tran_timesheet left join tran_project on tran_timesheet.id_tran_project = tran_project.id and month(tran_timesheet.tanggal) = ${
    request.month
  } right join tmst_pengguna on tran_project.id_peserta = tmst_pengguna.id where tmst_pengguna.status="MAHASISWA" and tmst_pengguna.nama like ${`${request.nama}%`} and tmst_pengguna.departemen like ${`${request.prodi}%`} and tmst_pengguna.id like ${`${request.nim}%`} group by tmst_pengguna.nama LIMIT ${
    request.size
  } OFFSET ${skip}) AS subquery;
  `;

  const result = await prismaClient.$queryRaw`
  select tmst_pengguna.departemen, tmst_pengguna.nama, tmst_pengguna.id, sum(tran_timesheet.total_sesi) as sisa_sesi, tmst_pengguna.no_telp from tran_timesheet left join tran_project on tran_timesheet.id_tran_project = tran_project.id and month(tran_timesheet.tanggal) = ${
    request.month
  } right join tmst_pengguna on tran_project.id_peserta = tmst_pengguna.id where tmst_pengguna.status="MAHASISWA" and tmst_pengguna.nama like ${`${request.nama}%`} and tmst_pengguna.departemen like ${`${request.prodi}%`} and tmst_pengguna.id like ${`${request.nim}%`} group by tmst_pengguna.nama LIMIT ${
    request.size
  } OFFSET ${skip};
  `;

  const totalItems = Number(countRaw[0].total_rows);

  result.forEach((data) => {
    if (data.sisa_sesi <= 40) {
      const sisa_jam = 40 - data.sisa_sesi;
      data.sisa_sesi = sisa_jam;
    } else if (data.sisa_sesi > 40) {
      const sisa_jam = 0;
      data.sisa_sesi = sisa_jam;
    }
  });
  return {
    data: result,
    paging: {
      page: request.page,
      total_item: totalItems,
      total_page: Math.ceil(totalItems / request.size),
    },
  };
};

const showEdit = async (timesheetId) => {
  timesheetId = validate(getId, timesheetId);

  const checkTimesheetId = await prismaClient.tran_timesheet.count({
    where: {
      id: timesheetId,
    },
  });

  if (checkTimesheetId !== 1) {
    throw new ResponseError(404, "Timesheet Id Not Found");
  }

  const showEdit = await prismaClient.tran_timesheet.findFirst({
    select: {
      id: true,
      id_kategori_kegiatan: true,
      id_tran_project: true,
      tanggal: true,
      jam_mulai: true,
      jam_selesai: true,
      deskripsi: true,
      total_sesi: true,
      tran_project: {
        select: {
          tmst_project: {
            select: {
              nama: true,
              tmst_pengguna: {
                select: {
                  nama: true,
                },
              },
              tmst_kategori_magang: {
                select: {
                  tran_insentif: {
                    select: {
                      durasi_satuan: true,
                    },
                  },
                  kategori: true,
                },
              },
            },
          },
        },
      },
    },
    where: {
      id: timesheetId,
      tran_project: {
        id_peserta: "105221036",
      },
    },
  });

  const nama_project = showEdit.tran_project.tmst_project.nama;
  const pic = showEdit.tran_project.tmst_project.tmst_pengguna.nama;
  const durasi_satuan = showEdit.tran_project.tmst_project.tmst_kategori_magang.tran_insentif.durasi_satuan;
  const kategori = showEdit.tran_project.tmst_project.tmst_kategori_magang.kategori;
  delete showEdit.tran_project;
  showEdit.pic = pic;
  showEdit.nama_project = nama_project;
  showEdit.durasi_satuan = durasi_satuan;
  showEdit.kategori = kategori;

  return showEdit;
};

const checkAvailable = async () => {
  const available = [];

  for (let i = 1; i <= 12; i++) {
    const result = await prismaClient.$queryRaw`
  select sum(tran_timesheet.total_sesi) as sisa_sesi from tran_timesheet left join tran_project on tran_timesheet.id_tran_project = tran_project.id and month(tran_timesheet.tanggal) = ${i} right join tmst_pengguna on tran_project.id_peserta = tmst_pengguna.id where tmst_pengguna.status="MAHASISWA" and tmst_pengguna.id = 105221036 group by nama;
  `;
    result.forEach((data) => {
      if (data.sisa_sesi <= 40) {
        const sisa_jam = 40 - data.sisa_sesi;
        data.sisa_sesi = sisa_jam;
      } else if (data.sisa_sesi > 40) {
        const sisa_jam = 0;
        data.sisa_sesi = sisa_jam;
      }
      available.push({
        month: i,
        sisa_sesi: data.sisa_sesi,
      });
    });
  }

  return available;
};

const selectAvailable = async (request) => {
  const id_pengguna = validate(getNIM, request);

  const result = await prismaClient.$queryRaw`
  select tmst_pengguna.departemen, tmst_pengguna.nama, tmst_pengguna.id, sum(tran_timesheet.total_sesi) as sisa_sesi, tmst_pengguna.no_telp from tran_timesheet left join tran_project on tran_timesheet.id_tran_project = tran_project.id right join tmst_pengguna on tran_project.id_peserta = tmst_pengguna.id where tmst_pengguna.status="MAHASISWA" and tmst_pengguna.id = ${`${id_pengguna}`} group by tmst_pengguna.nama LIMIT 1;
  `;

  let data_retrieve = {};
  result.forEach((data) => {
    data_retrieve = { id: data.id, nama: data.nama, departemen: data.departemen, sisa_sesi: data.sisa_sesi, no_telp: data.no_telp };
    if (data.sisa_sesi <= 40) {
      const sisa_jam = 40 - data.sisa_sesi;
      data.sisa_sesi = sisa_jam;
    } else if (data.sisa_sesi > 40) {
      data.sisa_sesi = sisa_jam;
    }
  });

  return data_retrieve;
};

const generatePdfTimesheet = async (request) => {
  let validatePdf = null;
  if (request.opsi) {
    validatePdf = validate(generatePdfTimesheetValidation, request);
  } else if (!request.opsi) {
    validatePdf = validate(getDataPdfTimesheetValidation, request);
  }

  const validateId = await prismaClient.tmst_pengguna.findFirst({
    where: {
      id: validatePdf.id_pengguna,
    },
  });

  if (!validateId) {
    return {
      data: { error: "Project Is Not Found!" },
    };
  }

  const checkTimesheet = await prismaClient.tran_timesheet.findFirst({
    where: {
      AND: [{ tanggal: { gte: new Date(`2023-${validatePdf.month}-01`) } }, { tanggal: { lt: new Date(`2023-${validatePdf.month + 1}-01`) } }],
      tran_project: {
        tmst_project: {
          nama: validatePdf.project,
        },
      },
    },
  });

  if (!checkTimesheet) {
    return {
      data: { error: "Project Is Not Found!" },
    };
  }

  const dataPdf = await prismaClient.tran_timesheet.findMany({
    select: {
      tanggal: true,
      jam_mulai: true,
      jam_selesai: true,
      deskripsi: true,
      total_sesi: true,
      tmst_kategori_kegiatan: {
        select: {
          kegiatan: true,
        },
      },
      tran_project: {
        select: {
          tmst_project: {
            select: {
              nama: true,
              inisial_project: true,
              tmst_kategori_magang: {
                select: {
                  kategori: true,
                  tran_insentif: {
                    select: {
                      tmst_satuan_insentif: {
                        select: {
                          satuan: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          tran_payment: {
            select: {
              url_file_sp3: true,
            },
          },
          tmst_pengguna: {
            select: {
              id: true,
              nama: true,
              departemen: true,
            },
          },
        },
      },
    },
    where: {
      tran_project: {
        tmst_project: {
          nama: validatePdf.project,
        },
        tmst_pengguna: {
          id: validatePdf.id_pengguna,
        },
      },
      tanggal: {
        gte: new Date(`2023-${validatePdf.month}-01`),
        lt: new Date(`2023-${validatePdf.month + 1}-01`),
      },
    },
  });

  console.log(dataPdf);
  console.log("WKWKWK");

  let NIM = null,
    nama = null,
    departemen = null,
    satuan = null,
    nama_project = null,
    kegiatan = null,
    url_file_sp3 = [],
    year = null,
    month = null,
    day = null,
    formattedDate = null,
    waktu = null,
    jam = null,
    menit = null,
    formatJamMenit = null,
    total_jam = 0,
    kategori_magang = null,
    inisial_project = null;

  function capitalizeEachWord(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  dataPdf.forEach((data) => {
    NIM = data.tran_project.tmst_pengguna.id;
    nama = capitalizeEachWord(data.tran_project.tmst_pengguna.nama);
    departemen = data.tran_project.tmst_pengguna.departemen;
    satuan = data.tran_project.tmst_project.tmst_kategori_magang.tran_insentif.tmst_satuan_insentif.satuan;
    nama_project = data.tran_project.tmst_project.nama;
    inisial_project = data.tran_project.tmst_project.inisial_project;
    kegiatan = data.tmst_kategori_kegiatan.kegiatan;
    kategori_magang = data.tran_project.tmst_project.tmst_kategori_magang.kategori;
    year = data.tanggal.getFullYear();
    month = data.tanggal.getMonth() + 1;
    day = data.tanggal.getDate();
    formattedDate = `${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}`;
    waktu = new Date(data.jam_mulai);
    jam = waktu.getUTCHours();
    menit = waktu.getUTCMinutes();
    formatJamMenit = `${jam.toString().padStart(2, "0")}:${menit.toString().padStart(2, "0")}`;
    data.jam_mulai = formatJamMenit;
    waktu = new Date(data.jam_selesai);
    jam = waktu.getUTCHours();
    menit = waktu.getUTCMinutes();
    formatJamMenit = `${jam.toString().padStart(2, "0")}:${menit.toString().padStart(2, "0")}`;
    data.tran_project.tran_payment.forEach((pay) => {
      url_file_sp3.push(pay.url_file_sp3);
    });
    if (satuan == "menit") {
      data.satuan = "jam";
    }
    total_jam += data.total_sesi;
    data.url_file_sp3 = url_file_sp3;
    data.jam_selesai = formatJamMenit;
    data.tanggal = formattedDate;
    data.NIM = NIM;
    data.nama = nama;
    data.departemen = departemen;
    data.nama_project = nama_project;
    data.inisial_project = inisial_project;
    data.kegiatan = kegiatan;
    data.kategori_magang = kategori_magang;
    delete data.tran_project;
    delete data.tmst_kategori_kegiatan;
    url_file_sp3 = [];
  });

  const total = {
    jam: total_jam,
  };

  let masterMonth = null;
  if (dataPdf.length !== 0) {
    const dataDate = dataPdf[0].tanggal;
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

    const finishMonth = `${monthName} ${getyear}`;
    masterMonth = {
      startMonth,
      finishMonth,
    };
  }

  let splitWeek = [];

  const inputMonth = validatePdf.month;

  const currentYear = new Date().getFullYear();

  let startDate = startOfMonth(new Date(currentYear, inputMonth - 1));
  let endDate = endOfMonth(new Date(currentYear, inputMonth - 1));

  // Pembagian minggu berdasarkan rentang tanggal
  const weeks = eachWeekOfInterval({ start: startDate, end: endDate });

  weeks.forEach((weekStart) => {
    let weekEnd = endOfWeek(weekStart);
    let formatWeekStart = format(weekStart, "yyyy-MM-dd");
    let formatWeekEnd = format(weekEnd, "yyyy-MM-dd");
    let object1 = { awal: formatWeekStart, akhir: formatWeekEnd };
    splitWeek.push(object1);
  });

  const headers = ["No", "Tanggal", "Kategori Kegiatan", "Rincian Kegiatan", "Waktu Mulai", "Waktu Selesai", "Jumlah Jam Kerja", "Tautan Dokumen Terkait"];

  function compareDates(a, b) {
    const dateA = new Date(a.tanggal);
    const dateB = new Date(b.tanggal);
    return dateA - dateB;
  }

  dataPdf.sort(compareDates);

  return {
    data: dataPdf,
    headers: headers,
    total: total,
    masterMonth: masterMonth,
    weeks: splitWeek,
  };
};

const getAllMahasiswaTimesheet = async (request) => {
  const validateData = validate(generateAllPdfValidation, request);
  const year = new Date().getFullYear();
  // const year = 2023;
  const monthParams = validateData.month;

  // Calculate the start date of the given monthParams
  const startDate = new Date(`${year}-${monthParams}-01`);

  // Calculate the end date (start of the next monthParams)
  let endDate;
  if (monthParams === 12) {
    // If December, increment the year and set monthParams to January
    endDate = new Date(`${year + 1}-${monthParams}-01`);
  } else {
    // For any other monthParams, just increment the monthParams
    endDate = new Date(`${year}-${monthParams + 1}-01`);
  }
  console.log(startDate);
  console.log(endDate);

  const checkTimesheet = await prismaClient.tran_timesheet.findFirst({
    where: {
      AND: [{ tanggal: { gte: startDate } }, { tanggal: { lt: endDate } }],
      tran_project: {
        tmst_project: {
          nama: validateData.project,
        },
      },
    },
  });
  console.log(checkTimesheet);

  if (!checkTimesheet) {
    return {
      data: { error: "Project Is Not Found!" },
    };
  }

  const result = await prismaClient.tran_timesheet.findMany({
    select: {
      tanggal: true,
      tran_project: {
        select: {
          tmst_project: {
            select: {
              nama: true,
              inisial_project: true,
            },
          },
          tmst_pengguna: {
            select: {
              id: true,
            },
          },
        },
      },
    },
    where: {
      AND: [{ tanggal: { gte: new Date(`2023-${validateData.month}-01`) } }, { tanggal: { lt: new Date(`2023-${validateData.month + 1}-01`) } }],
      tran_project: {
        tmst_project: {
          nama: validateData.project,
        },
      },
    },
  });

  let month = null,
    project = null,
    NIM = null,
    inisial_project = null;

  result.forEach((data) => {
    month = data.tanggal.getMonth() + 1;
    project = data.tran_project.tmst_project.nama;
    NIM = data.tran_project.tmst_pengguna.id;
    inisial_project = data.tran_project.tmst_project.inisial_project;
    data.month = month;
    data.project = project;
    data.NIM = NIM;
    data.inisial_project = inisial_project;
    delete data.tran_project;
  });

  return {
    data: result,
    initialProject: result[0].inisial_project,
  };
};

export default {
  create,
  remove,
  list,
  update,
  show,
  availableStudent,
  showEdit,
  checkAvailable,
  selectAvailable,
  generatePdfTimesheet,
  getAllMahasiswaTimesheet,
};
