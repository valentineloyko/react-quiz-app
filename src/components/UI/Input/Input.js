import React from 'react'
import classes from './Input.css'

//function for validation which accepts Input component props
function isInvalid({valid, touched, shouldValidate}){
	// we create condition where we check all the needed parameters (valid, touched, shouldValidate)
	// from Input props which we will pass to this component further on
	return !valid && shouldValidate && touched
}



const Input = props => {
	const inputType = props.type || 'text'
	const cls = [
		classes.Input,

	]
	//we generate unique string in this const, for label id below
	const htmlFor = `${inputType}-${Math.random()}`

	if (isInvalid(props)) {
		cls.push(classes.invalid)
	}

	return (
		<div className={cls.join(' ')}>

			<label htmlFor={htmlFor}>{props.label}</label>
			<input
				type = {inputType}
				id = {htmlFor}
				value = {props.value}
				onChange = {props.onChange}
			/>

			{/* JSX condition for span for error message and validation function, in case there are some mistakes in forms submit */}
			
			{isInvalid(props)
				? <span>{props.errorMessage || 'Введите верное значение'}</span>
				:null
			}


			
			


		</div>
	)
}

export default Input