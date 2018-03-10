"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
//import { HEROES} from "./mock-heros";
var OrderService = (function () {
    function OrderService(http) {
        this.http = http;
        this.tableOrders = [];
    }
    ;
    OrderService.prototype.extractData = function (res) {
        var body = res.json();
        return body || {};
    };
    OrderService.prototype.handleError = function (error) {
        var errMsg;
        if (error instanceof http_1.Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable_1.Observable.throw(errMsg);
    };
    OrderService.prototype.getEmptyOrder = function () {
        return Promise.resolve({
            itemCode: "",
            itemName: "",
            quantity: 1,
            rate: null,
            customisation: ""
        });
    };
    OrderService.prototype.getTablesInOrder = function () {
        var apiUrl = 'api/orders';
        return this.http.get(apiUrl).map(this.extractData).catch(this.handleError);
    };
    OrderService.prototype.getOrdersByTableNo = function (tableNo) {
        var apiUrl = 'api/orders/' + tableNo;
        return this.http.get(apiUrl).map(this.extractData).catch(this.handleError);
    };
    OrderService.prototype.addOrderToTableNo = function (tableNo, empName, orderItem) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        var postData = { tableNo: tableNo, EmpName: empName, orderItem: orderItem };
        var apiUrl = '/api/orders';
        return this.http.post(apiUrl, JSON.stringify(postData), options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    OrderService.prototype.getTablesAndEmpDetails = function () {
        var apiUrl = 'api/getdetail';
        return this.http.get(apiUrl).map(this.extractData).catch(this.handleError);
    };
    return OrderService;
}());
OrderService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map