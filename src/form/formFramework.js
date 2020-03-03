//this is function which will create framework for the form controls/inputs
//it excepts config (the number of some default fields) and bull validation parameters
//it spreads config params to array, adds 'touched', 'value' etc. And returns everything to the particular state

export function createControl (config, validation) {
	return {
		...config,
		validation,
		//if we passed on any validation rules, then the starting value of 'valid' should be 'false' 
		//to initiate validity check
		valid: !validation,
		touched: false,
		value: ''
	}
}


//this function creates framework for each particular control validation
export function validate (value, validation = null) {
	//we check whether the passing value is supposed to be validated, if there are
	//no validation parameters, we simply return true
	if (!validation) {
		return true
	}
	//if there are validation parameters, we create const isValid with default value 'true'
	// then we check for 'requred' --> based on QuizCreator 'question' and 'option' validation params
	let isValid = true

	//checking whether input is not empty and isValid hasn't changed from 'true
	if (validation.required) {
		isValid = value.trim() !== '' && isValid 
	}

	return isValid

}


//this function creates framework for the whole form validation
export function validateForm(formControls){
	let isFormValid=true

	//here we're looping throug the formControls array using 'for in', 
	//to check whether all the controls has .valid attribute set to true
	// another alternative with 'for each' loop we used in Auth.js
	for (let control in formControls) {
		if (formControls.hasOwnProperty(control)){
			isFormValid = formControls[control].valid && isFormValid
		}
	}

	return isFormValid
} 
