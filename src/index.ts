class TriggerableFunctions {
	functions: { [key: string]: (() => any)[] }
	constructor() {
		this.functions = {}
	}
	register(functionName: string, _function: () => any) {
		this.functions[functionName] = this.functions[functionName] || []
		this.functions[functionName].push(_function)
	}
	unregister(functionName: string) {
		delete this.functions[functionName]
	}
	trigger(functionName: string) {
		this.functions[functionName].forEach((_function) => _function())
	}
}
type ValidatorInitializerProps = {
	validationGroup?: Document | HTMLElement
	validClasses?: string[]
	invalidClasses?: string[]
	triggerName?: string
}

export default class ValidatorInitializer {
	validationGroup: Document | HTMLElement
	triggerName: string
	TriggerableFunctions: TriggerableFunctions
	elements: HTMLCollectionOf<Element>
	constructor(options?: ValidatorInitializerProps) {
		this.validationGroup = options?.validationGroup || document
		this.triggerName = options?.triggerName || ('validate' as string)
		this.TriggerableFunctions = new TriggerableFunctions()
		this.elements = this.validationGroup.getElementsByClassName('validate')
		Array.prototype.forEach.call(this.elements, (element) => {
			new Validator({
				validationGroup: this.validationGroup,
				element: element,
				validClasses: options?.validClasses,
				invalidClasses: options?.invalidClasses,
				triggerableFunctions: this.TriggerableFunctions,
				triggerName: this.triggerName,
			})
		})
	}
	trigger(triggerName: string) {
		this.TriggerableFunctions.trigger(triggerName)
	}
}

type ValidatorProps = {
	validationGroup: Document | HTMLElement
	element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
	validClasses?: string[]
	invalidClasses?: string[]
	triggerableFunctions: TriggerableFunctions
	triggerName: string
}

export class Validator {
	validationGroup: Document | HTMLElement
	element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
	validClasses?: string[]
	invalidClasses?: string[]
	name: string | null
	triggerableFunctions: TriggerableFunctions
	validations?: string[]
	formGroupElement: HTMLElement | null
	styleTargetElement: boolean
	errorTipElement: HTMLElement | null
	errorMessages: { [key: string]: string }
	validateFunctions: { [key: string]: () => void }
	value: number | boolean | string | null
	currentValidation: string | null
	constructor({ validationGroup, element, validClasses, invalidClasses, triggerableFunctions, triggerName }: ValidatorProps) {
		this.validationGroup = validationGroup
		this.element = element
		this.validClasses = validClasses
		this.invalidClasses = invalidClasses
		this.name = this.element.getAttribute('name')
		this.triggerableFunctions = triggerableFunctions
		this.validations = this.setValidations()
		this.formGroupElement = element.closest('.form-group')
		this.styleTargetElement = !!this.formGroupElement!.querySelector('.validate-style-target')
		this.errorTipElement = this.formGroupElement!.querySelector('.error-tip')
		this.errorMessages = this.setErrorMessages()
		this.validateFunctions = this.setValidateFunctions()
		this.value = null
		this.currentValidation = null
		this.triggerableFunctions.register(triggerName, () => this.validate())
		this.triggerableFunctions.register(`${triggerName}:${this.name}`, () => this.validate())
	}
	setValidations() {
		let validations = [] as string[]
		Array.prototype.forEach.call(this.element.classList, (_class: string) => {
			if (_class.match(/^validations::/)) validations = _class.split('::')[1].split(':')
		})
		return validations
	}
	setErrorMessages() {
		return {
			empty: 'この項目は必須です。',
			email: 'メールアドレスの形式が正しくありません。',
			confirmation: '入力内容が一致しません。',
			halfWidthNumber: '半角数字で入力してください。',
			katakana: '全角カタカナで入力してください。',
			hiragana: 'ひらがなで入力してください。',
		}
	}
	setValue() {
		this.value = this.element.value
	}
	setValidateFunctions() {
		return {
			empty: () => {
				const value = this.value as string
				switch (this.element.tagName) {
					case 'input' || 'textarea':
						if (this.value == '') this.showErrorMessage('empty')
						break
					case 'select':
						if (value == 'unselected' || value == '') this.showErrorMessage('empty')
						break
					default:
						break
				}
			},
			multipleEmpty: () => {
				let isMultipleEmptyValid = false as boolean
				let multipleEmptyGroup = '' as string
				Array.prototype.forEach.call(this.element.classList, (_class: string) => {
					if (_class.match(/^multipleEmptyGroup::/)) multipleEmptyGroup = _class.split('::')[1]
				})
				const multipleEmptyElements = document.querySelectorAll(`.multipleEmptyGroup\\:\\:${multipleEmptyGroup}`)
				Array.prototype.forEach.call(multipleEmptyElements, (element) => {
					if (element.value != '') isMultipleEmptyValid = true
				})
				if (!isMultipleEmptyValid) {
					let errorMessage = '' as string
					Array.prototype.forEach.call(multipleEmptyElements, (element, index) => {
						let multipleEmptyName = '' as string
						Array.prototype.forEach.call(element.classList, (_class: string) => {
							if (_class.match(/^multipleEmptyName::/)) multipleEmptyName = _class.split('::')[1]
						})
						errorMessage += index == 0 ? multipleEmptyName : `、${multipleEmptyName}`
						if (index == multipleEmptyElements.length - 1) errorMessage += `のいずれかの入力は必須です。`
					})
					this.showCustomErrorMessage(errorMessage)
				}
			},
			email: () => {
				const value = this.value as string
				if (value == '') return
				if (
					!value.match(
						/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.||~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.||~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
					)
				) {
					this.showErrorMessage('email')
				}
			},
			confirmation: () => {
				const value = this.value as string
				if (value == '') return
				let confirmationBase = '' as string
				Array.prototype.forEach.call(this.element.classList, (_class: string) => {
					if (_class.match(/^confirmationBase::/)) confirmationBase = _class.split('::')[1]
				})
				if (value != this.validationGroup.querySelector<HTMLInputElement>(`[name=${confirmationBase}]`)!.value) {
					this.showErrorMessage('confirmation')
				}
			},
			minimumCharacters: () => {
				const value = this.value as string
				if (value == '') return
				const minimumCharacters = this.currentValidation?.split('-')[1]
				if (value.length < Number(minimumCharacters)) this.showCustomErrorMessage(`${minimumCharacters}文字以上必要です。`)
			},
			maximumCharacters: () => {
				const value = this.value as string
				if (value == '') return
				const maximumCharacters = this.currentValidation?.split('-')[1]
				if (Number(maximumCharacters) < value.length) this.showCustomErrorMessage(`${maximumCharacters}文字以下で入力してください。`)
			},
			halfWidthNumber: () => {
				const value = this.value as string
				if (value == '') return
				if (!value.match(/^[0-9\s!"#\$%&'\(\)=~\|`{\+\*}<>\?_\-\^\\@\[;:\],\.\/\^]+$/)) this.showErrorMessage('halfWidthNumber')
			},
			katakana: () => {
				const value = this.value as string
				if (value == '') return
				if (!value.match(/^[ァ-ヾ０-９－\s　！”＃＄％＆’（）＝～｜‘｛＋＊｝＜＞？＿－＾￥＠「；：」、。・]+$/)) this.showErrorMessage('katakana')
			},
			hiragana: () => {
				const value = this.value as string
				if (value == '') return
				if (!value.match(/^[ぁ-んー０-９－\s　！”＃＄％＆’（）＝～｜‘｛＋＊｝＜＞？＿－＾￥＠「；：」、。・]+$/)) this.showErrorMessage('hiragana')
			},
			charactersRange: () => {
				const value = this.value as string
				if (value == '') return
				const minimumCharacters = this.currentValidation?.split('-')[1]
				const maximumCharacters = this.currentValidation?.split('-')[2]
				if (value.length < Number(minimumCharacters) || Number(maximumCharacters) < value.length) {
					this.showCustomErrorMessage(`${minimumCharacters}文字以上${maximumCharacters}以下で入力してください。`)
				}
			},
		}
	}
	showErrorMessage(validationName: string) {
		const p = document.createElement('p')
		p.textContent = this.errorMessages[validationName]
		this.errorTipElement!.appendChild(p)
		this.validClasses?.forEach((_class) => this.element.classList.remove(_class))
		this.element.classList.add('is-invalid')
		this.invalidClasses?.forEach((_class) => this.element.classList.add(_class))
	}
	showCustomErrorMessage(errorMessage: string) {
		const p = document.createElement('p')
		p.textContent = errorMessage
		this.errorTipElement!.appendChild(p)
		this.validClasses?.forEach((_class) => this.element.classList.remove(_class))
		this.element.classList.add('is-invalid')
		this.invalidClasses?.forEach((_class) => this.element.classList.add(_class))
	}
	validate() {
		if (Array.prototype.includes.call(this.element.classList, 'ignore-validation')) return
		this.setValue()
		this.errorTipElement!.innerHTML = ''
		this.validations!.forEach((validation) => {
			this.currentValidation = validation
			this.validateFunctions[validation.includes('-') ? validation.split('-')[0] : validation]()
			this.currentValidation = null
		})
		if (this.errorTipElement!.innerHTML == '') {
			this.validClasses?.forEach((_class) => this.element.classList.add(_class))
			this.element.classList.remove('is-invalid')
			this.invalidClasses?.forEach((_class) => this.element.classList.remove(_class))
		}
		if (this.validationGroup.querySelectorAll('.is-invalid').length)
			this.validationGroup.querySelectorAll('.is-invalid')[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
	}
}
