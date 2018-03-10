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
var order_service_1 = require("./order.service");
var OrderComponent = (function () {
    function OrderComponent(orderService) {
        this.orderService = orderService;
        this.currentTableNo = "";
        this.tables = [];
        this.employees = [];
        this.currentEmloyee = "";
        this.acTablesInOrder = [];
        this.nonAcTablesInOrder = [];
        this.takeAwayOrder = 0;
    }
    OrderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.setNewOrderEmpty();
        this.orderService.getTablesAndEmpDetails().subscribe(function (htlDetail) {
            _this.tables = htlDetail.tables,
                _this.employees = htlDetail.EmpList;
        });
        this.orderService.getTablesInOrder().subscribe(function (tbls) {
            for (var i = 0; i < tbls.length; i++) {
                _this.addCurrTblToCategory(tbls[i].tableNo);
            }
        });
        this.orderService.getOrdersByTableNo(this.currentTableNo).subscribe(function (tblOrder) {
            return _this.orderItems = tblOrder.orderItems;
        });
    };
    OrderComponent.prototype.keyDownFunction = function (event) {
        if (event.keyCode == 13) {
            if (this.isNewOrderEmpty()) {
            }
            else {
                this.orderService.addOrderToTableNo(this.currentTableNo, this.currentEmloyee, this.newEditOrder).subscribe(function (r) { });
                this.orderItems.push(this.newEditOrder);
                this.addCurrTblToCategory(this.currentTableNo);
                this.setNewOrderEmpty();
            }
        }
    };
    OrderComponent.prototype.setNewOrderEmpty = function () {
        this.newEditOrder = {
            itemCode: "",
            itemName: "",
            quantity: 1,
            rate: null,
            customisation: ""
        };
    };
    OrderComponent.prototype.isNewOrderEmpty = function () {
        return this.newEditOrder.itemCode == "" || this.newEditOrder.itemName == "" || this.newEditOrder.rate == null;
    };
    OrderComponent.prototype.onChangeTable = function (event) {
        var _this = this;
        this.orderService.getOrdersByTableNo(this.currentTableNo).subscribe(function (tblOrder) {
            _this.orderItems = tblOrder.orderItems;
            _this.currentEmloyee = tblOrder.EmpName;
        });
    };
    OrderComponent.prototype.getTableType = function (tableNo) {
        for (var i = 0; i < this.tables.length; i++) {
            if (this.tables[i].tblNo == tableNo)
                return this.tables[i].ac;
        }
        return -10;
    };
    OrderComponent.prototype.addCurrTblToCategory = function (tblNo) {
        var tblType = this.getTableType(parseInt(tblNo));
        switch (tblType) {
            case 1:
                if (this.acTablesInOrder.indexOf(tblNo) === -1)
                    this.acTablesInOrder.push(tblNo);
                break;
            case 0:
                if (this.nonAcTablesInOrder.indexOf(tblNo) === -1)
                    this.nonAcTablesInOrder.push(tblNo);
                break;
            case -1:
                ++this.takeAwayOrder;
                break;
            default:
                break;
        }
    };
    return OrderComponent;
}());
OrderComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'order',
        templateUrl: 'order.component.html',
        styleUrls: ['order.component.css'],
        providers: [order_service_1.OrderService]
    }),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderComponent);
exports.OrderComponent = OrderComponent;
//# sourceMappingURL=order.component.js.map