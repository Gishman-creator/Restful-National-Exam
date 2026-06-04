/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MaintenanceController } from './../controllers/maintenanceController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { InspectionController } from './../controllers/inspectionController';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "MaintenanceCreatePayload": {
        "dataType": "refObject",
        "properties": {
            "extinguisherId": {"dataType":"string","required":true},
            "inspectorId": {"dataType":"string","required":true},
            "actionTaken": {"dataType":"string","required":true},
            "dateOfAction": {"dataType":"datetime","required":true},
            "conditionNoted": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["Pass"]},{"dataType":"enum","enums":["Fail"]},{"dataType":"enum","enums":["NeedsMaintenance"]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MaintenanceUpdatePayload": {
        "dataType": "refObject",
        "properties": {
            "actionTaken": {"dataType":"string"},
            "dateOfAction": {"dataType":"datetime"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InspectionPayload": {
        "dataType": "refObject",
        "properties": {
            "extinguisherId": {"dataType":"string","required":true},
            "inspectorId": {"dataType":"string","required":true},
            "condition": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["Pass"]},{"dataType":"enum","enums":["Fail"]},{"dataType":"enum","enums":["NeedsMaintenance"]}],"required":true},
            "notes": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SchedulePayload": {
        "dataType": "refObject",
        "properties": {
            "extinguisherId": {"dataType":"string","required":true},
            "userId": {"dataType":"string","required":true},
            "scheduledDate": {"dataType":"datetime","required":true},
            "personnelNotified": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AnswerInspectionPayload": {
        "dataType": "refObject",
        "properties": {
            "condition": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["Pass"]},{"dataType":"enum","enums":["Fail"]},{"dataType":"enum","enums":["NeedsMaintenance"]}],"required":true},
            "notes": {"dataType":"string"},
            "inspectorId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsMaintenanceController_getMaintenanceLogs: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
                extinguisherId: {"in":"query","name":"extinguisherId","dataType":"string"},
        };
        app.get('/maintenance',
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController)),
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController.prototype.getMaintenanceLogs)),

            async function MaintenanceController_getMaintenanceLogs(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMaintenanceController_getMaintenanceLogs, request, response });

                const controller = new MaintenanceController();

              await templateService.apiHandler({
                methodName: 'getMaintenanceLogs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMaintenanceController_logMaintenance: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"MaintenanceCreatePayload"},
        };
        app.post('/maintenance',
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController)),
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController.prototype.logMaintenance)),

            async function MaintenanceController_logMaintenance(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMaintenanceController_logMaintenance, request, response });

                const controller = new MaintenanceController();

              await templateService.apiHandler({
                methodName: 'logMaintenance',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMaintenanceController_updateMaintenance: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"MaintenanceUpdatePayload"},
        };
        app.put('/maintenance/:id',
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController)),
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController.prototype.updateMaintenance)),

            async function MaintenanceController_updateMaintenance(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMaintenanceController_updateMaintenance, request, response });

                const controller = new MaintenanceController();

              await templateService.apiHandler({
                methodName: 'updateMaintenance',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInspectionController_getInspections: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
                extinguisherId: {"in":"query","name":"extinguisherId","dataType":"string"},
        };
        app.get('/inspections',
            ...(fetchMiddlewares<RequestHandler>(InspectionController)),
            ...(fetchMiddlewares<RequestHandler>(InspectionController.prototype.getInspections)),

            async function InspectionController_getInspections(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInspectionController_getInspections, request, response });

                const controller = new InspectionController();

              await templateService.apiHandler({
                methodName: 'getInspections',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInspectionController_createInspection: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"InspectionPayload"},
        };
        app.post('/inspections',
            ...(fetchMiddlewares<RequestHandler>(InspectionController)),
            ...(fetchMiddlewares<RequestHandler>(InspectionController.prototype.createInspection)),

            async function InspectionController_createInspection(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInspectionController_createInspection, request, response });

                const controller = new InspectionController();

              await templateService.apiHandler({
                methodName: 'createInspection',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInspectionController_scheduleInspection: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"SchedulePayload"},
        };
        app.post('/inspections/schedule',
            ...(fetchMiddlewares<RequestHandler>(InspectionController)),
            ...(fetchMiddlewares<RequestHandler>(InspectionController.prototype.scheduleInspection)),

            async function InspectionController_scheduleInspection(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInspectionController_scheduleInspection, request, response });

                const controller = new InspectionController();

              await templateService.apiHandler({
                methodName: 'scheduleInspection',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInspectionController_answerInspection: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"AnswerInspectionPayload"},
        };
        app.put('/inspections/:id/answer',
            ...(fetchMiddlewares<RequestHandler>(InspectionController)),
            ...(fetchMiddlewares<RequestHandler>(InspectionController.prototype.answerInspection)),

            async function InspectionController_answerInspection(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInspectionController_answerInspection, request, response });

                const controller = new InspectionController();

              await templateService.apiHandler({
                methodName: 'answerInspection',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
