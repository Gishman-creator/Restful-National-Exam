/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ExtinguisherController } from './../controllers/extinguisherController';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "ExtinguisherType": {
        "dataType": "refEnum",
        "enums": ["Water","Foam","CO2","DryPowder","WetChemical"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ExtinguisherSize": {
        "dataType": "refEnum",
        "enums": ["2.5 lbs.","5 lbs.","9 lbs.","12 lbs."],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ExtinguisherStatus": {
        "dataType": "refEnum",
        "enums": ["Active","RequiresMaintenance","Out-of-Service"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ExtinguisherCreateRequest": {
        "dataType": "refObject",
        "properties": {
            "serialNumber": {"dataType":"string","required":true},
            "type": {"ref":"ExtinguisherType","required":true},
            "size": {"ref":"ExtinguisherSize","required":true},
            "location": {"dataType":"string","required":true},
            "assignedTo": {"dataType":"string"},
            "status": {"ref":"ExtinguisherStatus"},
            "manufacturingDate": {"dataType":"datetime"},
            "expirationDate": {"dataType":"datetime"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedExtinguisherResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"any"},"required":true},
            "total": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
            "totalPages": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ExtinguisherUpdateRequest": {
        "dataType": "refObject",
        "properties": {
            "type": {"ref":"ExtinguisherType"},
            "size": {"ref":"ExtinguisherSize"},
            "location": {"dataType":"string"},
            "assignedTo": {"dataType":"string"},
            "status": {"ref":"ExtinguisherStatus"},
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


    
        const argsExtinguisherController_createExtinguisher: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"ExtinguisherCreateRequest"},
        };
        app.post('/extinguishers',
            ...(fetchMiddlewares<RequestHandler>(ExtinguisherController)),
            ...(fetchMiddlewares<RequestHandler>(ExtinguisherController.prototype.createExtinguisher)),

            async function ExtinguisherController_createExtinguisher(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsExtinguisherController_createExtinguisher, request, response });

                const controller = new ExtinguisherController();

              await templateService.apiHandler({
                methodName: 'createExtinguisher',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsExtinguisherController_getExtinguishers: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/extinguishers',
            ...(fetchMiddlewares<RequestHandler>(ExtinguisherController)),
            ...(fetchMiddlewares<RequestHandler>(ExtinguisherController.prototype.getExtinguishers)),

            async function ExtinguisherController_getExtinguishers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsExtinguisherController_getExtinguishers, request, response });

                const controller = new ExtinguisherController();

              await templateService.apiHandler({
                methodName: 'getExtinguishers',
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
        const argsExtinguisherController_getExtinguisher: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/extinguishers/:id',
            ...(fetchMiddlewares<RequestHandler>(ExtinguisherController)),
            ...(fetchMiddlewares<RequestHandler>(ExtinguisherController.prototype.getExtinguisher)),

            async function ExtinguisherController_getExtinguisher(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsExtinguisherController_getExtinguisher, request, response });

                const controller = new ExtinguisherController();

              await templateService.apiHandler({
                methodName: 'getExtinguisher',
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
        const argsExtinguisherController_updateExtinguisher: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"ExtinguisherUpdateRequest"},
        };
        app.put('/extinguishers/:id',
            ...(fetchMiddlewares<RequestHandler>(ExtinguisherController)),
            ...(fetchMiddlewares<RequestHandler>(ExtinguisherController.prototype.updateExtinguisher)),

            async function ExtinguisherController_updateExtinguisher(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsExtinguisherController_updateExtinguisher, request, response });

                const controller = new ExtinguisherController();

              await templateService.apiHandler({
                methodName: 'updateExtinguisher',
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
        const argsExtinguisherController_deleteExtinguisher: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/extinguishers/:id',
            ...(fetchMiddlewares<RequestHandler>(ExtinguisherController)),
            ...(fetchMiddlewares<RequestHandler>(ExtinguisherController.prototype.deleteExtinguisher)),

            async function ExtinguisherController_deleteExtinguisher(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsExtinguisherController_deleteExtinguisher, request, response });

                const controller = new ExtinguisherController();

              await templateService.apiHandler({
                methodName: 'deleteExtinguisher',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
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
