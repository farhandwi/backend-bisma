import express from "express";
import userController from "../controller/user-controller.js";
import tmstInternCategoryController from "../controller/tmst-internCategory-controller.js";
import tmstIncentiveUnitController from "../controller/tmst-incentiveUnit-controller.js";
import tranIncentiveController from "../controller/tran-incentive-controller.js";
import tmstUserController from "../controller/tmst-user-controller.js";
import tmstProjectController from "../controller/tmst-project-controller.js";
import tranProjectController from "../controller/tran-project-controller.js";
import tranTimesheetController from "../controller/tran-timesheet-controller.js";
import tmstActivityCategoryController from "../controller/tmst-activity-category-controller.js";
import tmstPaymentStatusController from "../controller/tmst-payment-status-controller.js";
import tmstStatusTimesheetController from "../controller/tmst-timesheet-status-controller.js";
import tmstPositionController from "../controller/tmst-position-controller.js";
import tranUserPositionController from "../controller/tran-user-position-controller.js";
import tranPaymentController from "../controller/tran-payment-controller.js";
import uploadSp3Controller from "../controller/upload-sp3-controller.js";

const publicRouter = new express.Router();

publicRouter.get("/", function (req, res) {
  res.status(200).json({
    message: "Application Programming Interface of BISMA Apps v.1.0.0",
  });
});

publicRouter.post("/api/users/register", userController.register);
publicRouter.post("/api/users/login", userController.login);

// Intern Category API
publicRouter.post("/api/internCategory", tmstInternCategoryController.create);
publicRouter.put("/api/internCategory/:categoryId", tmstInternCategoryController.update);
publicRouter.delete("/api/internCategory/:categoryId", tmstInternCategoryController.remove);
publicRouter.get("/api/internCategory", tmstInternCategoryController.list);
publicRouter.get("/api/internCategory/:categoryId", tmstInternCategoryController.select);

// Intern Unit API
publicRouter.post("/api/incentiveUnit", tmstIncentiveUnitController.create);
publicRouter.get("/api/incentiveUnit", tmstIncentiveUnitController.list);
publicRouter.put("/api/incentiveUnit/:unitId", tmstIncentiveUnitController.update);
publicRouter.delete("/api/incentiveUnit/:unitId", tmstIncentiveUnitController.remove);

// Incentive API
publicRouter.post("/api/incentive", tranIncentiveController.create);
publicRouter.get("/api/incentive", tranIncentiveController.list);
publicRouter.get("/api/incentive/get", tranIncentiveController.read);
publicRouter.put("/api/incentive/update/:incentiveId", tranIncentiveController.update);
publicRouter.delete("/api/incentive/:incentiveId", tranIncentiveController.remove);
publicRouter.get("/api/incentive/:incentiveId", tranIncentiveController.select);

// tmst_pengguna
publicRouter.post("/api/masterUser", tmstUserController.create);
publicRouter.delete("/api/masterUser/:userId", tmstUserController.remove);
publicRouter.get("/api/masterUser", tmstUserController.list);
publicRouter.put("/api/masterUser/:userId", tmstUserController.update);
publicRouter.get("/api/masterUser/showPic", tmstUserController.showPic);

// tmst_project
publicRouter.post("/api/masterProject", tmstProjectController.create);
publicRouter.delete("/api/masterProject/:projectId", tmstProjectController.remove);
publicRouter.get("/api/masterProject", tmstProjectController.list);
publicRouter.get("/api/masterProject/show/:userId", tmstProjectController.showAvailableStudent);
publicRouter.get("/api/masterProject/:projectId", tmstProjectController.select);
publicRouter.put("/api/masterProject/:projectId", tmstProjectController.update);

// tran_project
publicRouter.post("/api/project", tranProjectController.create);
publicRouter.delete("/api/project/:projectId", tranProjectController.remove);
publicRouter.get("/api/project", tranProjectController.list);
publicRouter.get("/api/project/user/:userId", tranProjectController.detailAvailableStudent);
publicRouter.get("/api/getDataPdfRecap", tranProjectController.generatePdf);
publicRouter.get("/api/generatePdfRecap", tranProjectController.recapPdf);
publicRouter.get("/api/project/timesheet/:userId", tranProjectController.get);
publicRouter.put("/api/project/:projectId", tranProjectController.update);
publicRouter.get("/api/project/:projectId", tranProjectController.getOne);

// tran_timesheet
publicRouter.post("/api/timesheet", tranTimesheetController.create);
publicRouter.delete("/api/timesheet/:timesheetId", tranTimesheetController.remove);
publicRouter.get("/api/timesheet", tranTimesheetController.list);
publicRouter.put("/api/timesheet/:timesheetId", tranTimesheetController.update);
publicRouter.get("/api/timesheet/show", tranTimesheetController.show);
publicRouter.get("/api/timesheet/edit/:timesheetId", tranTimesheetController.showEdit);
publicRouter.get("/api/availableStudent", tranTimesheetController.availableStudent);
publicRouter.get("/api/availableStudent/:userId", tranTimesheetController.selectAvailable);
publicRouter.get("/api/checkAvailable", tranTimesheetController.checkAvailable);
publicRouter.get("/api/getDataPdfTimesheet", tranTimesheetController.generatePdf);
publicRouter.get("/api/generatePdfTimesheet", tranTimesheetController.generatePdfTimesheet);
publicRouter.get("/api/generateAllPdf", tranTimesheetController.getAllPdf);

// tmst_kategori_kegiatan
publicRouter.post("/api/activity", tmstActivityCategoryController.create);
publicRouter.delete("/api/activity/:activityId", tmstActivityCategoryController.remove);
publicRouter.get("/api/activity", tmstActivityCategoryController.list);
publicRouter.put("/api/activity/:activityId", tmstActivityCategoryController.update);

// tmst_status_pembayaran
publicRouter.post("/api/paymentStatus", tmstPaymentStatusController.create);
publicRouter.delete("/api/paymentStatus/:statusId", tmstPaymentStatusController.remove);
publicRouter.get("/api/paymentStatus", tmstPaymentStatusController.list);
publicRouter.put("/api/paymentStatus/:statusId", tmstPaymentStatusController.update);

// tmst_status_timesheet
publicRouter.post("/api/timesheetStatus", tmstStatusTimesheetController.create);
publicRouter.delete("/api/timesheetStatus/:statusId", tmstStatusTimesheetController.remove);
publicRouter.get("/api/timesheetStatus", tmstStatusTimesheetController.list);
publicRouter.put("/api/timesheetStatus/:statusId", tmstStatusTimesheetController.update);

// tmst_positions
publicRouter.post("/api/positions", tmstPositionController.create);
publicRouter.delete("/api/positions/:positionId", tmstPositionController.remove);
publicRouter.get("/api/positions", tmstPositionController.list);
publicRouter.put("/api/positions/:positionId", tmstPositionController.update);

// tran_user_position
publicRouter.post("/api/usersPosition", tranUserPositionController.create);
publicRouter.delete("/api/usersPosition/:userId", tranUserPositionController.remove);
publicRouter.get("/api/usersPosition", tranUserPositionController.list);
publicRouter.put("/api/usersPosition/:userId", tranUserPositionController.update);

// tran_payment
publicRouter.post("/api/payments", tranPaymentController.create);
publicRouter.get("/api/payments", tranPaymentController.list);
publicRouter.get("/api/payments/listAdmin/:status", tranPaymentController.list_admin);
publicRouter.get("/api/payments/showSp3", tranPaymentController.showSp3);
publicRouter.get("/api/payments/listAdmin/detail/:projectId", tranPaymentController.detail_payment);
publicRouter.delete("/api/payments/:paymentId", tranPaymentController.remove);
publicRouter.put("/api/payments/:paymentId", tranPaymentController.update);

//upload
publicRouter.post("/api/uploadSp3/:id", uploadSp3Controller.controllerUploadSp3);

export { publicRouter };
