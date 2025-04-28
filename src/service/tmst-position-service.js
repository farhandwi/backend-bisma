import { validate } from "../validation/validation.js";
import { createAndUpdateValidation, deletePositionValidation } from "../validation/tmst-position-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

const create = async (request) => {
  const data = validate(createAndUpdateValidation, request);

  const createPosition = prismaClient.tmst_posisi.create({
    data: data,
    select: {
      id: true,
      posisi: true,
    },
  });

  return createPosition;
};

const update = async (request) => {
  const data = validate(createAndUpdateValidation, request);

  const cekAvailable = await prismaClient.tmst_posisi.findFirst({
    where: {
      id: data.id,
    },
  });

  if (!cekAvailable) {
    throw new ResponseError(404, "Id Not Found!");
  }

  const updateData = prismaClient.tmst_posisi.update({
    where: {
      id: data.id,
    },
    data: {
      posisi: data.posisi,
    },
    select: {
      id: true,
      posisi: true,
    },
  });

  return updateData;
};

const list = async () => {
  return prismaClient.tmst_posisi.findMany({
    select: {
      id: true,
      posisi: true,
    },
  });
};

const remove = async (request) => {
  const id = validate(deletePositionValidation, request);
  const cekAvailable = await prismaClient.tmst_posisi.findFirst({
    where: {
      id: id,
    },
  });

  if (!cekAvailable) {
    throw new ResponseError(404, "Id Not Found!");
  }

  return prismaClient.tmst_posisi.delete({
    where: {
      id: id,
    },
  });
};

export default { create, update, list, remove };
