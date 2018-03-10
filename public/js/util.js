var fnStartInterval = function (_timeoutInfo) {

    var id = GUID();

    _timeoutInfo['id'] = id;
    _timeoutInfo['interval'] = _timeoutInfo['interval'] !== undefined ? _timeoutInfo['interval'] : 1000;

    //initial assigning the value...
    gXorTimeouts[id] = _timeoutInfo;

    var func = _timeoutInfo['func'];
    if (func === undefined) {
        alert('timer function is not assigned for ' + _timeoutInfo['name']);
        return;
    }

    fnExecuteInterval(_timeoutInfo);

    return id;
}

var fnExecuteInterval = function (_timeoutInfo) {

    if (_timeoutInfo === undefined) {
        return;
    }

    var id = _timeoutInfo['id'];
    if (gXorTimeouts[id] === undefined) {
        return;
    }

    gXorTimeouts[id].handle = setInterval(function () {
        _timeoutInfo['func'](_timeoutInfo);
    }, _timeoutInfo['interval']);
}


var fnStopInterval = function (_id) {

    if (_id === undefined || _id === "") {
        return;
    }

    var timeoutInfo = gXorTimeouts[_id];

    //if timer does not exist in the list
    if (timeoutInfo === undefined) {
        return;
    }


    var name = timeoutInfo['name'];
    //stop if waiting for execution...
    clearInterval(timeoutInfo.handle);

    //remove the entry from global list
    delete gXorTimeouts[_id];
}


var fnGetUTCDate = function (date) {
    var newDate = new Date(date);
    var year = newDate.getUTCFullYear();
    var mnth = parseInt(newDate.getUTCMonth()) + 1;
    mnth = pad(mnth);
    var day = newDate.getUTCDate();
    day = pad(day);
    return year + '-' + mnth + '-' + day;

    function pad(number) {
        var r = String(number);
        if (r.length === 1) {
            r = '0' + r;
        }
        return r;
    }
}


var fnFinishInterval = function (_timeoutInfo) {

    var id = _timeoutInfo['id'];
    var name = _timeoutInfo['name'];

    //if timer does not exist in the list
    if (gXorTimeouts[id] === undefined) {
        return;
    }

    //stop if waiting for execution...
    clearInterval(gXorTimeouts[id].handle);

    //remove the entry from global list
    delete gXorTimeouts[id];
}

var showNotification = function (msg, isError) {
    noty({
        layout: 'bottomLeft',// can be top - topLeft - topCenter - topRight - center - centerLeft - centerRight - bottom - bottomLeft - bottomCenter - bottomRight
        theme: 'defaultTheme',
        type: isError ? "error" : "success",// can be alert - success - error - warning - information - confirmation
        text: msg, // can be html or string
        dismissQueue: true, // If you want to use queue feature set this true
        template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
        animation: {
            open: {height: 'toggle'},
            close: {height: 'toggle'},
            easing: 'swing',
            speed: 500 // opening & closing animation speed
        },
        timeout: 5000, // delay for closing event. Set false for sticky notifications
        force: false, // adds notification to the beginning of queue when set to true
        modal: false,
        maxVisible: 3, // you can set max visible notification for dismissQueue true option,
        killer: false, // for close all notifications before show
        closeWith: ['click'], // ['click', 'button', 'hover']
        callback: {
            onShow: function () {
            },
            afterShow: function () {
            },
            onClose: function () {
            },
            afterClose: function () {
            }
        },
        buttons: false // an array of buttons
    });


    /*var cls = !isError ? "gritter-success" : "gritter-error";
     $.gritter.add({
     title: msg,
     text: "",
     class_name: cls + (!$('#gritter-light').get ? ' gritter-light' : '')
     });*/
}

function ShowSpinnerOn(targetElm, bShow) {
    $('.ez-spin:first', targetElm).css("visibility", bShow ? "visible" : "hidden");
}
function ShowSpinner(_selector, isShow, options) {
    options = options || {};

    var opts;
    var $spinnerTarget = options.targetSpecific ? $(_selector) : $('body');

    options.disablebg && $spinnerTarget.css({'pointer-events': 'none', 'opacity': '0.7'});

    if (isShow === true) {
        opts = options || {
                corners: 1,
                length: 9,
                lines: 12,
                radius: 10,
                rotate: 0,
                speed: 1,
                trail: 60,
                width: 5
            };
    }
    else {
        $spinnerTarget.css({'pointer-events': '', 'opacity': ''});
        opts = false;
    }

    //at screen center
    try {
        if (options.targetSpecific) {
            var selectorOffset = $spinnerTarget.offset();
            opts.top = (selectorOffset.top + $spinnerTarget.height() / 2) + 'px';
            opts.left = (selectorOffset.left + $spinnerTarget.width() / 2) + 'px';
        }
        else {
            opts.top = opts.top || ($(window).height() / 2) + 'px';
            opts.left = opts.left || ($(window).width() / 2) + 'px';
        }
        opts.position = 'fixed';
    }
    catch (e) {
        console.log('Spinner Error: ', e.stack);
    }

    $(_selector).spin(opts);
};

var alertex = function (_header, _body, _options) {

    var options = _options || {}; //{btn:'',icon:''}
    var btn = options.btn || "OK";
    var isHtml = options.html;
    var icon;

    switch (options.icon) {
        case alertex.param.warning:
            icon = 'icon-warning-sign alert-icon-warning';
            break;
        case alertex.param.error:
            icon = 'icon-minus-sign alert-icon-error';
            break;
        case alertex.param.spinner:
            icon = 'icon-spinner icon-spin orange ez-spin-bar';
            break;
        case alertex.param.info:
        default:
            icon = 'icon-info-sign alert-icon-info';
            break;

    }


    $('#alert-modal').html($('#alert-modal-template').tmpl({
        Modalheader: _header,
        Modalbody: (isHtml) ? "" : _body,
        Modalbtn: btn,
        iconclass: icon
    }).html());
    if (isHtml) {
        $('#alert-modal .modal-body-text > p').html(_body);
    }

    $('.ok-button', '#alert-modal').on('click', options.onok);
    $('.close', '#alert-modal').on('click', options.onclose);
    $('#alert-modal').bind('hide', options.onhide);

    $('#alert-modal').modal('show');
}
alertex.param = {
    warning: 1,
    error: 2,
    info: 3,
    spinner: 4
}

var confirmex = function (_header, _body, _function, btnopts, btnClasses) {  //btnopts::{labelCancel:'',labelOk:''} to change the label of buttons
    var icon = 'icon-question-sign alert-icon-success';
    var defaultBtnClasses = {CONFIRM: "btn-primary", CANCEL: "btn-grey"};

    var $dlgObj = null;
    if (_.isObject(btnClasses)) {
        bootbox.setBtnClasses(btnClasses);
    } else
        bootbox.setBtnClasses(defaultBtnClasses);

    var $confirmTemp = $('#confirm-modal-template').tmpl({Modalheader: _header, Modalbody: _body, iconclass: icon});

    if (_.isArray(btnopts) && btnopts.length > 2) {
        $dlgObj = bootbox.dialog($confirmTemp, btnopts);
    }
    else if (_.isObject(btnopts)) {
        $dlgObj = bootbox.confirm($confirmTemp, btnopts.labelCancel, btnopts.labelOk, _function);
    }
    else
        $dlgObj = bootbox.confirm($confirmTemp, _function);

    //set default focus on cancel so that on press enter cancel button will capture event
    $dlgObj.on('shown', function () {
        $dlgObj.find("a.btn-primary").blur();
        $dlgObj.find("a.btn-grey").focus();
    });

    $('.close', $confirmTemp).on('click', function () {
        _function(false);
    });
}

var promptex = function (_header, _function) {
    var icon = "icon-element";
    bootbox.prompt(_header, _function);
    //bootbox.prompt($("#prompt-modal-template").tmpl({ Modalheader: _header, iconclass: icon }), _function);
}

var dialogex = function (options) {

    /*CALL:: dialogex({title:'',
     body:'',
     icon:'',
     buttons:{ok:{label:'',class:'',data_dismiss:true/false,events:{'click':funcion,'hover':function}},
     success:{label:'success!',class:'',data_dismiss:true/false,events:{'click':funcion,'hover':function}}
     }
     close:function
     });
     */


    options = options || {};
    var dlgOpts = {};

    dlgOpts.title = options.title || "Dialog";   // Dialog title

    dlgOpts.body = options.body || '';          // Dialog content

    dlgOpts.icon = options.icon || '';            // Dialog icon

    dlgOpts.close = options.close;              // on dialog hide event

    dlgOpts.footer = options.footer || '';

    /// dlgOpts.backdrop = options.backdrop;

    dlgOpts.bOnCloseDatadiMiss = _.isUndefined(options.bOnCloseDatadiMiss) ? true : options.bOnCloseDatadiMiss;

    dlgOpts.open = options.open;
    dlgOpts.hide = options.hide;

    dlgOpts.initialize = options.initialize;

    $cusDialog = $('<div class="custom-dialog modal span6 widget-container-span ui-sortable">');//$('#custom-dialog');
    if (options.containerClass)
        $cusDialog.addClass(options.containerClass);
    $cusDialog.hide();


    if (options.width)
        $cusDialog.css("width", options.width);
    if (options.height)
        $cusDialog.css("height", options.height);

    function CalculateBodyHgt() { // 95 px include header and footer height
        return ($cusDialog.height() - 95);
    }


    function Initialize() {

        $cusDialog.draggable({
            containment: "parent",
            handle: ".modal-header"
        });


        /*** resizable **/
        var orgWidth = $cusDialog.width();
        var orgHeight = $cusDialog.height();

        $(".widget-body", $cusDialog).css("height", CalculateBodyHgt());

        $cusDialog.resizable({
            handles: 'w,e',
            minWidth: orgWidth,
            minHeight: orgHeight,
            start: function () {
                $('iframe').css({'pointer-events': 'none'});
            },
            stop: function () {
                $('iframe').css({'pointer-events': ''});
            },
            resize: function (event, ui) {

                var calWidth = ui.size.width;
                var calHeight = ui.size.height;
                $(this).css({

                    width: calWidth + "px",
                    height: calHeight + "px"
                });

            }
        });
        /**/


        if (typeof dlgOpts.initialize == 'function')
            dlgOpts.initialize();
        if (typeof dlgOpts.open == 'function')
            dlgOpts.open();
    }


    function CreateDefaultButtons() {

        return {
            OK: {
                'label': 'OK', 'class': 'btn-info', 'data_dismiss': true, 'events': {}
            },
            Cancel: {
                'label': 'Cancel', 'class': 'btn-grey', 'data_dismiss': true, 'events': {}
            }
        };
    }

    function getButtonID(btn) {
        return 'cusdlg-btn-' + btn;
    }

    dlgOpts.buttons = options.buttons || CreateDefaultButtons();    // List of buttong with events  {OK:{label:''class:'',data-dismiss:'',events:{click:fn}}}}


    $('#modal-dialog-template').tmpl(dlgOpts, {
        getButtonName: function (obj) {

        },
        getButtonID: getButtonID
    }).appendTo($cusDialog);

    $('.widget-body', $cusDialog).html(dlgOpts.body);

    $('.dlg-buttons', $cusDialog).prepend(dlgOpts.footer);
    // Bind Evnets
    $cusDialog.unbind('hide');
    $cusDialog.bind('hide', function (e) {
        if (e.target == this) {
            $cusDialog.remove();

            if (dlgOpts.hide)
                dlgOpts.hide();

        }
    });

    $(".dlg-close", $cusDialog).click(function () {
        if (dlgOpts.close)
            dlgOpts.close();
    });

    for (var key in dlgOpts.buttons) {
        var button = dlgOpts.buttons[key];
        if (button.events) {
            var events = button.events;
            var len = button.events.length;
            for (var event in events) {
                $('.' + getButtonID(key), $cusDialog).bind(event, events[event]);
            }
        }
    }

    $cusDialog.modal({show: true, backdrop: false, keyboard: false});
    Initialize();

}

var ProcessArray = function (_arrayObj, _callFunction, _onComplete) {

    var todo = _arrayObj.concat();
    setTimeout(function () {
        _callFunction(todo.shift());
        if (todo.length > 0) {
            //do stuff if need
            setTimeout(arguments.callee, 0);
        }
        else {
            if (_onComplete)
                _onComplete();
        }
    }, 25);

}

var editableex = function ($selector, options, onChangeFunc, successCallBack, validatefunc, errorCallBack) {

    if (!options)
        options = {};

    var type = options.type || "text";
    var container = options.container || null;
    var disabled = options.disabled || false;
    var mode = options.mode || "popup";
    var onblur = options.onblur || "cancel";
    var placement = options.placement || "top";
    var toggle = options.toggle || "click";
    var selector = options.selector || null;
    var template = options.template || null;
    var rows = options.rows || 7;
    var iframeSelector = options.iframeSelector || null;
    validatefunc = validatefunc || null;
    errorCallBack = errorCallBack || null;

    $($selector).editable({
        type: type,
        template: template,
        rows: rows,
        url: onChangeFunc,
        success: successCallBack,
        error: errorCallBack,
        validate: validatefunc,
        disabled: disabled,
        mode: mode,
        onblur: onblur,
        placement: placement,
        container: container,
        toggle: toggle,
        selector: selector,
        iframeSelector: iframeSelector,
        inputclass: "autosize-transition"
        //showbuttons : "bottom"
    });

}
function IsJsonString(str) {
    try {
        var obj = JSON.parse(str);
        if (obj === "number")
            return false;
    } catch (e) {
        return false;
    }
    return true;
}
function IsValidURL(textval) {
    var urlregex = new RegExp(/^(https?:\/\/)?([a-zA-Z0-9]+([a-zA-Z0-9-.]+)?[^\bwww\b].\b(com|org|net|mil|edu|de|co.in)\b)|(((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i);
    return urlregex.test(textval);
}
function getButtonsTmp(options) {
    //var prop = new setButtonsProp({ isEdit: options.isEdit, isDelete: options.isDelete, isDownload: options.isDownload, isComment: options.isComment, isImp: options.isImp, isExcel: options.isExcel, isHTML: options.isHTML, isLabel: options.isLabel,saveVersion:options.saveVersion });
    var template = $('#Buttons-Template').tmpl(options);
    return template[0].outerHTML;

    //return appSect16.templates.ButtonsTemplate(options);

};
$.fn.spin = function (opts) {
    this.each(function () {
        var $this = $(this),
            data = $this.data();

        if (data.spinner) {
            data.spinner.stop();
            delete data.spinner;
        }
        if (opts !== false) {
            data.spinner = new Spinner($.extend({color: $this.css('color')}, opts)).spin(this);
        }
    });
    return this;
};
$.fn.dataTableExt.oApi.fnVisibleColumnCount = function (oSettings) {
    var visibleCount = 0;
    var colCount = oSettings.aoColumns.length;

    for (var iIndex = 0; iIndex < colCount; iIndex++)
        if (oSettings.aoColumns[iIndex].bVisible)
            visibleCount++;

    return visibleCount;
};
$.fn.dataTableExt.oApi.fnStandingRedraw = function (oSettings) {
    if (oSettings.oFeatures.bServerSide === false) {
        var before = oSettings._iDisplayStart;

        oSettings.oApi._fnReDraw(oSettings);

        // iDisplayStart has been reset to zero - so lets change it back
        oSettings._iDisplayStart = before;
        oSettings.oApi._fnCalculateEnd(oSettings);
    }

    // draw the 'current' page
    oSettings.oApi._fnDraw(oSettings);
};

var guid = (function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return function () {
        return s4() + s4() + s4() + s4() +
            s4() + s4();
    };
})();