var TriggerableFunctions = /** @class */ (function () {
    function TriggerableFunctions() {
        this.functions = {};
    }
    TriggerableFunctions.prototype.register = function (functionName, _function) {
        this.functions[functionName] = this.functions[functionName] || [];
        this.functions[functionName].push(_function);
    };
    TriggerableFunctions.prototype.unregister = function (functionName) {
        delete this.functions[functionName];
    };
    TriggerableFunctions.prototype.trigger = function (functionName) {
        this.functions[functionName].forEach(function (_function) { return _function(); });
    };
    return TriggerableFunctions;
}());
export { TriggerableFunctions };
var ValidatorInitializer = /** @class */ (function () {
    function ValidatorInitializer(_a) {
        var _this = this;
        var validationGroup = _a.validationGroup, triggerName = _a.triggerName;
        this.validationGroup = validationGroup || document;
        this.triggerName = triggerName || 'validate';
        this.TriggerableFunctions = new TriggerableFunctions();
        this.elements = this.validationGroup.getElementsByClassName('validate');
        Array.prototype.forEach.call(this.elements, function (element) {
            new Validator({
                validationGroup: _this.validationGroup,
                element: element,
                triggerableFunctions: _this.TriggerableFunctions,
                triggerName: _this.triggerName,
            });
        });
    }
    ValidatorInitializer.prototype.trigger = function (triggerName) {
        this.TriggerableFunctions.trigger(triggerName);
    };
    return ValidatorInitializer;
}());
export default ValidatorInitializer;
var Validator = /** @class */ (function () {
    function Validator(_a) {
        var _this = this;
        var element = _a.element, triggerableFunctions = _a.triggerableFunctions, triggerName = _a.triggerName, validationGroup = _a.validationGroup;
        this.validationGroup = validationGroup;
        this.element = element;
        this.name = this.element.getAttribute('name');
        this.triggerableFunctions = triggerableFunctions;
        this.validations = this.setValidations();
        this.formGroupElement = element.closest('.form-group');
        this.errorTipElement = this.formGroupElement.querySelector('.error-tip');
        this.errorMessages = this.setErrorMessages();
        this.validateFunctions = this.setValidateFunctions();
        this.value = null;
        this.currentValidation = null;
        this.triggerableFunctions.register(triggerName, function () { return _this.validate(); });
        this.triggerableFunctions.register("".concat(triggerName, ":").concat(this.name), function () { return _this.validate(); });
    }
    Validator.prototype.setValidations = function () {
        var validations = [];
        Array.prototype.forEach.call(this.element.classList, function (_class) {
            if (_class.match(/^validations::/))
                validations = _class.split('::')[1].split(':');
        });
        return validations;
    };
    Validator.prototype.setErrorMessages = function () {
        return {
            empty: 'この項目は必須です。',
            email: 'メールアドレスが不正です。',
            confirmation: '入力内容が一致しません。',
            halfWidthNumber: '半角数字で入力してください。',
            katakana: '全角カタカナで入力してください。',
            hiragana: 'ひらがなで入力してください。',
        };
    };
    Validator.prototype.setValue = function () {
        this.value = this.element.value;
    };
    Validator.prototype.setValidateFunctions = function () {
        var _this = this;
        return {
            empty: function () {
                if (_this.value == '')
                    _this.showErrorMessage('empty');
            },
            multipleEmpty: function () {
                var isMultipleEmptyValid = false;
                var multipleEmptyGroup = '';
                Array.prototype.forEach.call(_this.element.classList, function (_class) {
                    if (_class.match(/^multipleEmptyGroup::/))
                        multipleEmptyGroup = _class.split('::')[1];
                });
                var multipleEmptyElements = document.querySelectorAll(".multipleEmptyGroup\\:\\:".concat(multipleEmptyGroup));
                Array.prototype.forEach.call(multipleEmptyElements, function (element) {
                    if (element.value != '')
                        isMultipleEmptyValid = true;
                });
                if (!isMultipleEmptyValid) {
                    var errorMessage_1 = '';
                    Array.prototype.forEach.call(multipleEmptyElements, function (element, index) {
                        var multipleEmptyName = '';
                        Array.prototype.forEach.call(element.classList, function (_class) {
                            if (_class.match(/^multipleEmptyName::/))
                                multipleEmptyName = _class.split('::')[1];
                        });
                        errorMessage_1 += index == 0 ? multipleEmptyName : "\u3001".concat(multipleEmptyName);
                        if (index == multipleEmptyElements.length - 1)
                            errorMessage_1 += "\u306E\u3044\u305A\u308C\u304B\u306E\u5165\u529B\u306F\u5FC5\u9808\u3067\u3059\u3002";
                    });
                    _this.showCustomErrorMessage(errorMessage_1);
                }
            },
            selectEmpty: function () {
                var value = _this.value;
                if (value == 'unselected' || value == '')
                    _this.showErrorMessage('empty');
            },
            email: function () {
                var value = _this.value;
                if (value == '')
                    return;
                if (!value.match(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.||~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.||~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i)) {
                    _this.showErrorMessage('email');
                }
            },
            confirmation: function () {
                var value = _this.value;
                if (value == '')
                    return;
                var confirmationBase = '';
                Array.prototype.forEach.call(_this.element.classList, function (_class) {
                    if (_class.match(/^confirmationBase::/))
                        confirmationBase = _class.split('::')[1];
                });
                if (value != _this.validationGroup.querySelector("[name=".concat(confirmationBase, "]")).value) {
                    _this.showErrorMessage('confirmation');
                }
            },
            minimumCharacters: function () {
                var _a;
                var value = _this.value;
                if (value == '')
                    return;
                var minimumCharacters = (_a = _this.currentValidation) === null || _a === void 0 ? void 0 : _a.split('-')[1];
                if (value.length < Number(minimumCharacters))
                    _this.showCustomErrorMessage("".concat(minimumCharacters, "\u6587\u5B57\u4EE5\u4E0A\u5FC5\u8981\u3067\u3059\u3002"));
            },
            maximumCharacters: function () {
                var _a;
                var value = _this.value;
                if (value == '')
                    return;
                var maximumCharacters = (_a = _this.currentValidation) === null || _a === void 0 ? void 0 : _a.split('-')[1];
                if (Number(maximumCharacters) < value.length)
                    _this.showCustomErrorMessage("".concat(maximumCharacters, "\u6587\u5B57\u4EE5\u4E0B\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002"));
            },
            halfWidthNumber: function () {
                var value = _this.value;
                if (value == '')
                    return;
                if (!value.match(/^[0-9\s!"#\$%&'\(\)=~\|`{\+\*}<>\?_\-\^\\@\[;:\],\.\/\^]+$/))
                    _this.showErrorMessage('halfWidthNumber');
            },
            katakana: function () {
                var value = _this.value;
                if (value == '')
                    return;
                if (!value.match(/^[ァ-ヾ０-９－\s　！”＃＄％＆’（）＝～｜‘｛＋＊｝＜＞？＿－＾￥＠「；：」、。・]+$/))
                    _this.showErrorMessage('katakana');
            },
            hiragana: function () {
                var value = _this.value;
                if (value == '')
                    return;
                if (!value.match(/^[ぁ-んー０-９－\s　！”＃＄％＆’（）＝～｜‘｛＋＊｝＜＞？＿－＾￥＠「；：」、。・]+$/))
                    _this.showErrorMessage('hiragana');
            },
            charactersRange: function () {
                var _a, _b;
                var value = _this.value;
                if (value == '')
                    return;
                var minimumCharacters = (_a = _this.currentValidation) === null || _a === void 0 ? void 0 : _a.split('-')[1];
                var maximumCharacters = (_b = _this.currentValidation) === null || _b === void 0 ? void 0 : _b.split('-')[2];
                if (value.length < Number(minimumCharacters) || Number(maximumCharacters) < value.length) {
                    _this.showCustomErrorMessage("".concat(minimumCharacters, "\u6587\u5B57\u4EE5\u4E0A").concat(maximumCharacters, "\u4EE5\u4E0B\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002"));
                }
            },
        };
    };
    Validator.prototype.showErrorMessage = function (validationName) {
        var p = document.createElement('p');
        p.textContent = this.errorMessages[validationName];
        this.errorTipElement.appendChild(p);
        this.element.classList.add('is-invalid');
    };
    Validator.prototype.showCustomErrorMessage = function (errorMessage) {
        var p = document.createElement('p');
        p.textContent = errorMessage;
        this.errorTipElement.appendChild(p);
        this.element.classList.add('is-invalid');
    };
    Validator.prototype.validate = function () {
        var _this = this;
        if (Array.prototype.includes.call(this.element.classList, 'ignore-validation'))
            return;
        this.setValue();
        this.errorTipElement.innerHTML = '';
        this.validations.forEach(function (validation) {
            _this.currentValidation = validation;
            _this.validateFunctions[validation.includes('-') ? validation.split('-')[0] : validation]();
            _this.currentValidation = null;
        });
        if (this.errorTipElement.innerHTML == '')
            this.element.classList.remove('is-invalid');
        if (!!this.validationGroup.querySelectorAll('.is-invalid').length)
            this.validationGroup.querySelectorAll('.is-invalid')[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    return Validator;
}());
export { Validator };
