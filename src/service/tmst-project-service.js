import { validate } from "../validation/validation.js";
import { showAvailableStudentValidation, createAndUpdateValidation, tmstProjectId, listProjectValidation } from "../validation/tmst-project-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { format } from "date-fns";
import { FieldExistsAsNonTerminalError } from "pdf-lib";

const create = async (request) => {
  const project = validate(createAndUpdateValidation, request);

  const validateId = await prismaClient.tmst_kategori_magang.count({
    where: {
      id: project.id_kategori,
    },
  });

  if (validateId === 0) {
    throw new ResponseError(400, "Category is not found!");
  } else if (validateId > 1) {
    throw new ResponseError(400, "Category is already exist!");
  }

  const validateUser = await prismaClient.tmst_pengguna.count({
    where: {
      id: project.pic,
    },
  });

  if (validateUser === 0) {
    throw new ResponseError(400, "User is not found!");
  }

  const validateName = await prismaClient.tmst_project.count({
    where: {
      nama: project.nama,
    },
  });

  if (validateName === 1) {
    throw new ResponseError(400, "Name already in use!");
  }

  function takeCharacterFirst(words, length) {
    const result = words.map((word) => word.slice(0, 1)).slice(0, length);
    return result.join("");
  }

  function capitalizeEachWord(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  project.nama = capitalizeEachWord(project.nama);
  const trimmedInitialProject = project.nama.trim();
  const words = trimmedInitialProject.split(" ");
  let initialProject = null;

  const getInitialProject = await prismaClient.tmst_project.findMany({
    select: {
      inisial_project: true,
    },
  });
  let numberProject = 1;

  function checkInitialProject(initialProject, numberProject) {
    getInitialProject.forEach((initial) => {
      if (initial.inisial_project == initialProject) {
        initialProject = initialProject + numberProject;
        getInitialProject.forEach((checkSame) => {
          if (initialProject == checkSame.inisial_project) {
            numberProject++;
            initialProject = initialProject + numberProject;
          }
        });
      }
    });
    return initialProject;
  }

  if (words.length >= 4) {
    initialProject = takeCharacterFirst(words, 4);
    initialProject = checkInitialProject(initialProject, numberProject);
  } else if (words.length == 3) {
    initialProject = takeCharacterFirst(words, 3);
    initialProject = checkInitialProject(initialProject, numberProject);
  } else if (words.length == 2) {
    initialProject = takeCharacterFirst(words, 2);
    initialProject = checkInitialProject(initialProject, numberProject);
  } else if (words.length == 1) {
    initialProject = takeCharacterFirst(words, 1);
    initialProject = checkInitialProject(initialProject, numberProject);
  }

  project.inisial_project = initialProject;

  const createProject = prismaClient.tmst_project.create({
    data: project,
    select: {
      id: true,
      id_kategori: true,
      nama: true,
      inisial_project: true,
      pic: true,
      tanggal_mulai: true,
      tanggal_selesai: true,
    },
  });

  return createProject;
};

const remove = async (projectId) => {
  projectId = validate(tmstProjectId, projectId);

  const totalInDatabase = await prismaClient.tmst_project.count({
    where: {
      id: projectId,
    },
  });

  if (totalInDatabase !== 1) {
    throw new ResponseError(404, "Project is not found");
  }

  return prismaClient.tmst_project.delete({
    where: {
      id: projectId,
    },
  });
};

const list = async (request) => {
  request = validate(listProjectValidation, request);
  const skip = (request.page - 1) * request.size;
  console.log(request.namaProjek);
  const filters = [];

  if (request.namaProjek) {
    filters.push({
      nama: {
        contains: request.namaProjek,
      },
    });
  }

  console.log(filters);

  const getProject = await prismaClient.tmst_project.findMany({
    select: {
      id: true,
      id_kategori: true,
      nama: true,
      inisial_project: true,
      pic: true,
      tanggal_mulai: true,
      tanggal_selesai: true,
      tran_project: {
        select: {
          estimasi: true,
          tmst_pengguna: {
            select: {
              nama: true,
            },
          },
        },
      },
    },
    where: {
      AND: filters,
    },
    take: request.size,
    skip: skip,
  });

  let members = [];
  let estimation = [];
  let totalEstimasi = null;
  getProject.forEach((data) => {
    data.tran_project.forEach((data) => {
      members.push(data.tmst_pengguna.nama);
      estimation.push(data.estimasi);
    });
    totalEstimasi = estimation.reduce((acc, curr) => acc + curr, 0);
    data.totalEstimasi = totalEstimasi;
    data.members = members;
    data.estimasi = estimation;
    data.countMember = members.length;
    members = [];
    estimation = [];
    totalEstimasi = null;
    delete data.tran_project;
  });

  const totalItems = await prismaClient.tmst_project.count({
    where: {
      AND: filters,
    },
  });

  // const modifiedProjects = getProject.map((data) => {
  //   const memberNames = data.project_tran_project.map((item) => item.peserta_pengguna.nama);

  //   return {
  //     ...data,
  //     member: memberNames,
  //     countMember: memberNames.length,
  //     project_tran_project: undefined,
  //   };
  // });

  return {
    data: getProject,
    paging: {
      page: request.page,
      total_item: totalItems,
      total_page: Math.ceil(totalItems / request.size),
    },
  };
};

const update = async (request) => {
  const project = validate(createAndUpdateValidation, request);
  const totalProjectInDatabase = await prismaClient.tmst_project.count({
    where: {
      id: project.id,
    },
  });

  if (totalProjectInDatabase !== 1) {
    throw new ResponseError(404, "Project is not found");
  }

  return prismaClient.tmst_project.update({
    where: {
      id: project.id,
    },
    data: {
      id_kategori: project.id_kategori,
      nama: project.nama,
      pic: project.pic,
      tanggal_mulai: project.tanggal_mulai,
      tanggal_selesai: project.tanggal_selesai,
    },
    select: {
      id: true,
      id_kategori: true,
      nama: true,
      pic: true,
      tanggal_mulai: true,
      tanggal_selesai: true,
    },
  });
};

const select = async (request) => {
  const projectId = validate(tmstProjectId, request);

  const validateID = await prismaClient.tmst_project.count({
    where: {
      id: projectId,
    },
  });

  if (validateID !== 1) {
    throw new ResponseError(404, "Project Id Not Found!");
  }
  const getProject = await prismaClient.tmst_project.findFirst({
    select: {
      id: true,
      inisial_project: true,
      tmst_kategori_magang: {
        select: {
          kategori: true,
          id: true,
        },
      },
      tmst_pengguna: {
        select: {
          nama: true,
          id: true,
        },
      },
      nama: true,
      tanggal_mulai: true,
      tanggal_selesai: true,
      tran_project: {
        select: {
          id: true,
          estimasi: true,
          tmst_pengguna: {
            select: {
              id: true,
              nama: true,
            },
          },
        },
      },
    },
    where: {
      id: projectId,
    },
  });

  if (!getProject) {
    throw new ResponseError(404, "Id Not Found!");
  }

  let anggota = [];
  let estimasi = [];
  let id_tran_project = [];
  let id_anggota = [];
  let totalEstimasi = null;
  let kategori = null;
  let kategoriId = null;
  let pic = null;
  let picId = null;

  getProject.tran_project.forEach((data) => {
    id_tran_project.push(data.id);
    anggota.push(data.tmst_pengguna.nama);
    id_anggota.push(data.tmst_pengguna.id);
    estimasi.push(data.estimasi);
  });
  pic = getProject.tmst_pengguna.nama;
  picId = getProject.tmst_pengguna.id;
  kategori = getProject.tmst_kategori_magang.kategori;
  kategoriId = getProject.tmst_kategori_magang.id;
  totalEstimasi = estimasi.reduce((acc, curr) => acc + curr, 0);
  getProject.kategori = kategori;
  getProject.kategoriId = kategoriId;
  getProject.totalEstimasi = totalEstimasi;
  getProject.tanggal_mulai = format(getProject.tanggal_mulai, "dd/MM/yyyy");
  getProject.tanggal_selesai = format(getProject.tanggal_selesai, "dd/MM/yyyy");
  getProject.pic = pic;
  getProject.picId = picId;
  getProject.anggota = anggota;
  getProject.id_anggota = id_anggota;
  getProject.estimasi = estimasi;
  getProject.countMember = anggota.length;
  getProject.id_tran_project = id_tran_project;
  anggota = [];
  id_anggota = [];
  id_tran_project = null;
  pic = null;
  picId = null;
  totalEstimasi = null;
  kategori = null;
  delete getProject.tran_project;
  delete getProject.tmst_kategori_magang;
  delete getProject.tmst_pengguna;

  // const modifiedProjects = getProject.map((data) => {
  //   const memberNames = data.project_tran_project.map((item) => item.peserta_pengguna.nama);

  //   return {
  //     ...data,
  //     member: memberNames,
  //     countMember: memberNames.length,
  //     project_tran_project: undefined,
  //   };
  // });

  return getProject;
};

const showAvailableStudent = async (request) => {
  const id_peserta = validate(showAvailableStudentValidation, request);

  let data_available = [];
  let temp = {};
  const data_tranProject = await prismaClient.tran_project.findMany({
    select: {
      id_peserta: true,
      id_project: true,
    },
    where: {
      id_peserta: id_peserta,
    },
  });

  const data_tmstProject = await prismaClient.tmst_project.findMany({
    select: {
      id: true,
      nama: true,
      tanggal_mulai: true,
      tanggal_selesai: true,
    },
  });

  let check = false;

  data_tmstProject.forEach((data) => {
    data_tranProject.forEach((dt) => {
      if (data.id === dt.id_project) {
        check = true;
      }
    });
    if (check === false) {
      temp = { id: data.id, nama: data.nama, tanggal_mulai: data.tanggal_mulai, tanggal_selesai: data.tanggal_selesai };
      data_available.push(temp);
    }
    check = false;
  });

  return data_available;
};

export default {
  create,
  remove,
  list,
  update,
  select,
  showAvailableStudent,
};
