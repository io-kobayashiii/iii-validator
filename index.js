(()=>{"use strict";!function(){function t(){this.functions={}}t.prototype.register=function(t,e){this.functions[t]=this.functions[t]||[],this.functions[t].push(e)},t.prototype.unregister=function(t){delete this.functions[t]},t.prototype.trigger=function(t){this.functions[t].forEach((function(t){return t()}))}}();!function(){function t(t){var e=this,i=t.element,r=t.triggerableFunctions,a=t.triggerName,n=t.validationGroup;this.validationGroup=n,this.element=i,this.name=this.element.getAttribute("name"),this.triggerableFunctions=r,this.validations=this.setValidations(),this.formGroupElement=i.closest(".form-group"),this.errorTipElement=this.formGroupElement.querySelector(".error-tip"),this.errorMessages=this.setErrorMessages(),this.validateFunctions=this.setValidateFunctions(),this.value=null,this.currentValidation=null,this.triggerableFunctions.register(a,(function(){return e.validate()})),this.triggerableFunctions.register("".concat(a,":").concat(this.name),(function(){return e.validate()}))}t.prototype.setValidations=function(){var t=[];return Array.prototype.forEach.call(this.element.classList,(function(e){e.match(/^validations::/)&&(t=e.split("::")[1].split(":"))})),t},t.prototype.setErrorMessages=function(){return{empty:"この項目は必須です。",email:"メールアドレスが不正です。",confirmation:"入力内容が一致しません。",halfWidthNumber:"半角数字で入力してください。",katakana:"全角カタカナで入力してください。",hiragana:"ひらがなで入力してください。"}},t.prototype.setValue=function(){this.value=this.element.value},t.prototype.setValidateFunctions=function(){var t=this;return{empty:function(){""==t.value&&t.showErrorMessage("empty")},multipleEmpty:function(){var e=!1,i="";Array.prototype.forEach.call(t.element.classList,(function(t){t.match(/^multipleEmptyGroup::/)&&(i=t.split("::")[1])}));var r=document.querySelectorAll(".multipleEmptyGroup\\:\\:".concat(i));if(Array.prototype.forEach.call(r,(function(t){""!=t.value&&(e=!0)})),!e){var a="";Array.prototype.forEach.call(r,(function(t,e){var i="";Array.prototype.forEach.call(t.classList,(function(t){t.match(/^multipleEmptyName::/)&&(i=t.split("::")[1])})),a+=0==e?i:"、".concat(i),e==r.length-1&&(a+="のいずれかの入力は必須です。")})),t.showCustomErrorMessage(a)}},selectEmpty:function(){var e=t.value;"unselected"!=e&&""!=e||t.showErrorMessage("empty")},email:function(){var e=t.value;""!=e&&(e.match(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.||~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.||~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i)||t.showErrorMessage("email"))},confirmation:function(){var e=t.value;if(""!=e){var i="";Array.prototype.forEach.call(t.element.classList,(function(t){t.match(/^confirmationBase::/)&&(i=t.split("::")[1])})),e!=t.validationGroup.querySelector("[name=".concat(i,"]")).value&&t.showErrorMessage("confirmation")}},minimumCharacters:function(){var e,i=t.value;if(""!=i){var r=null===(e=t.currentValidation)||void 0===e?void 0:e.split("-")[1];i.length<Number(r)&&t.showCustomErrorMessage("".concat(r,"文字以上必要です。"))}},maximumCharacters:function(){var e,i=t.value;if(""!=i){var r=null===(e=t.currentValidation)||void 0===e?void 0:e.split("-")[1];Number(r)<i.length&&t.showCustomErrorMessage("".concat(r,"文字以下で入力してください。"))}},halfWidthNumber:function(){var e=t.value;""!=e&&(e.match(/^[0-9\s!"#\$%&'\(\)=~\|`{\+\*}<>\?_\-\^\\@\[;:\],\.\/\^]+$/)||t.showErrorMessage("halfWidthNumber"))},katakana:function(){var e=t.value;""!=e&&(e.match(/^[ァ-ヾ０-９－\s　！”＃＄％＆’（）＝～｜‘｛＋＊｝＜＞？＿－＾￥＠「；：」、。・]+$/)||t.showErrorMessage("katakana"))},hiragana:function(){var e=t.value;""!=e&&(e.match(/^[ぁ-んー０-９－\s　！”＃＄％＆’（）＝～｜‘｛＋＊｝＜＞？＿－＾￥＠「；：」、。・]+$/)||t.showErrorMessage("hiragana"))},charactersRange:function(){var e,i,r=t.value;if(""!=r){var a=null===(e=t.currentValidation)||void 0===e?void 0:e.split("-")[1],n=null===(i=t.currentValidation)||void 0===i?void 0:i.split("-")[2];(r.length<Number(a)||Number(n)<r.length)&&t.showCustomErrorMessage("".concat(a,"文字以上").concat(n,"以下で入力してください。"))}}}},t.prototype.showErrorMessage=function(t){var e=document.createElement("p");e.textContent=this.errorMessages[t],this.errorTipElement.appendChild(e),this.element.classList.add("is-invalid")},t.prototype.showCustomErrorMessage=function(t){var e=document.createElement("p");e.textContent=t,this.errorTipElement.appendChild(e),this.element.classList.add("is-invalid")},t.prototype.validate=function(){var t=this;Array.prototype.includes.call(this.element.classList,"ignore-validation")||(this.setValue(),this.errorTipElement.innerHTML="",this.validations.forEach((function(e){t.currentValidation=e,t.validateFunctions[e.includes("-")?e.split("-")[0]:e](),t.currentValidation=null})),""==this.errorTipElement.innerHTML&&this.element.classList.remove("is-invalid"),this.validationGroup.querySelectorAll(".is-invalid").length&&this.validationGroup.querySelectorAll(".is-invalid")[0].scrollIntoView({behavior:"smooth",block:"center"}))}}()})();