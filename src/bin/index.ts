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
	validityStyleTarget: HTMLElement | null
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
		this.validityStyleTarget = this.formGroupElement!.querySelector('.validity-style-target')
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
				switch (this.element.tagName) {
					case 'INPUT' || 'TEXTAREA':
						if (this.value == '') {
							this.showErrorMessage('empty')
							this.adjustValidationClasses({ validity: false })
						}
						break
					case 'SELECT':
						if ((this.value as string) == 'unselected' || (this.value as string) == '') {
							this.showErrorMessage('empty')
							this.adjustValidationClasses({ validity: false })
						}
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
					this.adjustValidationClasses({ validity: false })
				}
			},
			email: () => {
				if (
					!(this.value as string).match(
						/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.||~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.||~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
					)
				) {
					this.showErrorMessage('email')
					this.adjustValidationClasses({ validity: false })
				}
			},
			confirmation: () => {
				let confirmationBase = '' as string
				Array.prototype.forEach.call(this.element.classList, (_class: string) => {
					if (_class.match(/^confirmationBase::/)) confirmationBase = _class.split('::')[1]
				})
				if ((this.value as string) != this.validationGroup.querySelector<HTMLInputElement>(`[name=${confirmationBase}]`)!.value) {
					this.showErrorMessage('confirmation')
					this.adjustValidationClasses({ validity: false })
				}
			},
			minimumCharacters: () => {
				const minimumCharacters = this.currentValidation?.split('-')[1]
				if ((this.value as string).length < Number(minimumCharacters)) {
					this.showCustomErrorMessage(`${minimumCharacters}文字以上必要です。`)
					this.adjustValidationClasses({ validity: false })
				}
			},
			maximumCharacters: () => {
				const maximumCharacters = this.currentValidation?.split('-')[1]
				if (Number(maximumCharacters) < (this.value as string).length) {
					this.showCustomErrorMessage(`${maximumCharacters}文字以下で入力してください。`)
					this.adjustValidationClasses({ validity: false })
				}
			},
			halfWidthNumber: () => {
				if (!(this.value as string).match(/^[0-9\s!"#$%&'()=~|`{+*}<>?_\-^\\@[;:\],./^]+$/)) {
					this.showErrorMessage('halfWidthNumber')
					this.adjustValidationClasses({ validity: false })
				}
			},
			katakana: () => {
				if (!(this.value as string).match(/^[ァ-ヾ０-９－\s　！”＃＄％＆’（）＝～｜‘｛＋＊｝＜＞？＿－＾￥＠「；：」、。・]+$/)) {
					this.showErrorMessage('katakana')
					this.adjustValidationClasses({ validity: false })
				}
			},
			hiragana: () => {
				if (!(this.value as string).match(/^[ぁ-んー０-９－\s　！”＃＄％＆’（）＝～｜‘｛＋＊｝＜＞？＿－＾￥＠「；：」、。・]+$/)) {
					this.showErrorMessage('hiragana')
					this.adjustValidationClasses({ validity: false })
				}
			},
			charactersRange: () => {
				const minimumCharacters = this.currentValidation?.split('-')[1]
				const maximumCharacters = this.currentValidation?.split('-')[2]
				if ((this.value as string).length < Number(minimumCharacters) || Number(maximumCharacters) < (this.value as string).length) {
					this.showCustomErrorMessage(`${minimumCharacters}文字以上${maximumCharacters}以下で入力してください。`)
					this.adjustValidationClasses({ validity: false })
				}
			},
		}
	}
	showErrorMessage(validationName: string) {
		const p = document.createElement('p')
		p.textContent = this.errorMessages[validationName]
		this.errorTipElement!.appendChild(p)
	}
	showCustomErrorMessage(errorMessage: string) {
		const p = document.createElement('p')
		p.textContent = errorMessage
		this.errorTipElement!.appendChild(p)
	}
	adjustValidationClasses({ validity }: { validity: boolean }) {
		if (validity) {
			this.element.classList.remove('is-invalid')
			this.validClasses?.forEach((_class) => {
				this.element.classList.add(_class)
				this.validityStyleTarget?.classList.add(_class)
			})
			this.invalidClasses?.forEach((_class) => {
				this.element.classList.remove(_class)
				this.validityStyleTarget?.classList.remove(_class)
			})
		} else {
			this.element.classList.add('is-invalid')
			this.validClasses?.forEach((_class) => {
				this.element.classList.remove(_class)
				this.validityStyleTarget?.classList.remove(_class)
			})
			this.invalidClasses?.forEach((_class) => {
				this.element.classList.add(_class)
				this.validityStyleTarget?.classList.add(_class)
			})
		}
	}
	validate() {
		if (Array.prototype.includes.call(this.element.classList, 'ignore-validation')) return
		this.setValue()
		this.errorTipElement!.innerHTML = ''
		this.validations!.forEach((validation) => {
			this.currentValidation = validation
			if (validation == 'empty' || validation == 'multipleEmpty') this.validateFunctions[validation]()
			if (validation != 'empty' && (this.value as string) != '') this.validateFunctions[validation.includes('-') ? validation.split('-')[0] : validation]()
			this.currentValidation = null
		})
		if (this.errorTipElement!.innerHTML == '') this.adjustValidationClasses({ validity: true })
		if (this.validationGroup.querySelectorAll('.is-invalid').length) this.validationGroup.querySelectorAll('.is-invalid')[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
	}
}
