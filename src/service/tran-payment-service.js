import { request } from "express";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createPaymentValidation, UpdatePaymentValidation, deletePaymentValidation, listAdminValidation, showSp3Validation } from "../validation/tran-payment-validation.js";
import { validate } from "../validation/validation.js";
import axios from "axios";

const create = async (request) => {
  const payment = validate(createPaymentValidation, request);

  const checkStatus = await prismaClient.tmst_status_pembayaran.findFirst({
    where: {
      id: payment.id_status,
    },
  });

  if (!checkStatus) {
    throw new ResponseError(404, "Status Not Found!");
  }
  const projectName = await prismaClient.tmst_project.findFirst({
    where: {
      id: payment.id_tran_project,
    },
    select: {
      nama: true,
    },
  });
  const resultPdf = await axios.get(`http://localhost:8000/api/getDataPdfTimesheet?project=${projectName.nama}&month=${payment.periode}`);

  payment.total_tagihan = resultPdf.data.total.total_insentif;

  const dataPayment = await prismaClient.tran_payment.create({
    data: payment,
    select: {
      id: true,
      id_status: true,
      periode: true,
      id_tran_project: true,
      total_tagihan: true,
      url_file_sp3: true,
    },
  });

  dataPayment.nama_project = projectName.nama;
  return dataPayment;
};

const remove = async (request) => {
  const id = validate(deletePaymentValidation, request);

  const validateId = await prismaClient.tran_payment.findFirst({
    where: {
      id: id,
    },
  });

  if (!validateId) {
    throw new ResponseError(404, "Id Not Found!");
  }

  return prismaClient.tran_payment.delete({
    where: {
      id: id,
    },
  });
};

const list = async () => {
  return prismaClient.tran_payment.findMany({
    select: {
      id: true,
      id_status: true,
      periode: true,
      id_tran_project: true,
      total_tagihan: true,
      url_file_sp3: true,
    },
  });
};

const update = async (request) => {
  const dataUpdate = validate(UpdatePaymentValidation, request);

  const validateId = await prismaClient.tran_payment.findFirst({
    where: {
      id: dataUpdate.id,
    },
  });

  if (!validateId) {
    throw new ResponseError(404, "Id Not Found!");
  }

  const data = prismaClient.tran_payment.update({
    where: {
      id: dataUpdate.id,
    },
    data: {
      id_tran_project: dataUpdate.id_tran_project,
      periode: dataUpdate.periode,
      total_tagihan: dataUpdate.total_tagihan,
      url_file_sp3: dataUpdate.url_file_sp3,
      id_status: dataUpdate.id_status,
    },
    select: {
      id: true,
      id_status: true,
      periode: true,
      id_tran_project: true,
      total_tagihan: true,
      url_file_sp3: true,
    },
  });

  return data;
};

const list_admin = async (request) => {
  request = validate(listAdminValidation, request);
  const skip = (request.page - 1) * request.size;

  const filters = [];
  let totalItems;

  if (request.namaProjek) {
    filters.push({
      nama: {
        contains: request.namaProjek,
      },
    });
  }

  let data;
  if (request.status == "waiting") {
    data = await prismaClient.tran_payment.findMany({
      select: {
        id: true,
        tran_project: {
          select: {
            tmst_project: {
              select: {
                nama: true,
                tanggal_mulai: true,
                tanggal_selesai: true,
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
        id_status: 2,
        tran_project: {
          tmst_project: {
            AND: filters,
          },
        },
      },
      take: request.size,
      skip: skip,
    });
  } else if (request.status == "submitted") {
    data = await prismaClient.tran_payment.findMany({
      select: {
        id: true,
        tran_project: {
          select: {
            tmst_project: {
              select: {
                nama: true,
                tanggal_mulai: true,
                tanggal_selesai: true,
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
        id_status: 1,
        tran_project: {
          tmst_project: {
            AND: filters,
          },
        },
      },
      take: request.size,
      skip: skip,
    });
  } else if (request.status == "paid") {
    data = await prismaClient.tran_payment.findMany({
      select: {
        id: true,
        tran_project: {
          select: {
            tmst_project: {
              select: {
                nama: true,
                tanggal_mulai: true,
                tanggal_selesai: true,
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
        id_status: 3,
        tran_project: {
          tmst_project: {
            AND: filters,
          },
        },
      },
      take: request.size,
      skip: skip,
    });
  }
  let nama = null;
  let tanggal_mulai = null;
  let tanggal_selesai = null;
  let namaUser = [];
  data.forEach((dt) => {
    nama = dt.tran_project.tmst_project.nama;
    tanggal_mulai = dt.tran_project.tmst_project.tanggal_mulai;
    tanggal_selesai = dt.tran_project.tmst_project.tanggal_selesai;
    namaUser.push(dt.tran_project.tmst_pengguna.nama);
    dt.nama = nama;
    dt.tanggal_mulai = tanggal_mulai;
    dt.tanggal_selesai = tanggal_selesai;
    delete dt.tran_project;
    dt.namaUser = namaUser;
  });

  let objekPenelusur = {};

  data.forEach((item) => {
    let kunci = item.nama;
    if (!objekPenelusur[kunci]) {
      objekPenelusur[kunci] = { ...item, jumlah: 1 };
    } else {
      objekPenelusur[kunci].jumlah++;
    }
  });

  let array_hasil = Object.values(objekPenelusur);

  return {
    data: array_hasil,
    paging: {
      page: request.page,
      total_item: array_hasil.length,
      total_page: Math.ceil(array_hasil.length / request.size),
    },
  };
};

const detail_payment = async (request) => {
  const id = validate(deletePaymentValidation, request);
  const data = await prismaClient.tran_payment.findMany({
    select: {
      tran_project: {
        select: {
          tran_timesheet: {
            select: {
              tmst_kategori_kegiatan: {
                select: {
                  kegiatan: true,
                },
              },
              tanggal: true,
              jam_mulai: true,
              jam_selesai: true,
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
      id_status: 2,
      AND: {
        tran_project: {
          tmst_project: {
            id: id,
          },
        },
      },
    },
  });

  let kegiatan = [];
  let tanggal = [];
  let jam_mulai = [];
  let jam_selesai = [];
  let nama_pengguna;

  data.forEach((dt) => {
    dt.tran_project.tran_timesheet.forEach((d) => {
      kegiatan.push(d.tmst_kategori_kegiatan.kegiatan);
      tanggal.push(d.tanggal);
      jam_mulai.push(d.jam_mulai);
      jam_selesai.push(d.jam_selesai);
    });
    nama_pengguna = dt.tran_project.tmst_pengguna.nama;
    dt.kegiatan = kegiatan;
    dt.tanggal = tanggal;
    dt.jam_mulai = jam_mulai;
    dt.jam_selesai = jam_selesai;
    dt.nama = nama_pengguna;
    delete dt.tran_project;
  });

  return data;
};

const showSp3 = async (request) => {
  const sp3 = validate(showSp3Validation, request);

  const data = await prismaClient.tmst_project.findFirst({
    select: {
      inisial_project: true,
    },
    where: {
      id: sp3.idProject,
    },
  });

  return data;
};

export default { create, remove, list, update, list_admin, detail_payment, showSp3 };
