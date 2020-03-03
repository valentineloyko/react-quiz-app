import React, {Component} from 'react'
import classes from './Auth.css'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import is from 'is_js'
import {connect} from 'react-redux'
import {auth} from '../../store/actions/auth'

class Auth extends Component {

	//setting state for form control (email and password inputs)

	state = {
		isFormValid: false,
		formControls: {
			email: {
				value: '',
				type: 'email',
				label: 'Email',
				errorMessage: 'Введите корректный email',
				valid: false,
				touched: false,
				validation: {
					required: true,
					email: true
				}
			},
			password: {
				value: '',
				type: 'password',
				label: 'Password',
				errorMessage: 'Введите корректный пароль',
				valid: false,
				touched: false,
				validation: {
					required: true,
					minLength: 6
				}
			}
		}
	}


	loginHandler = () => {

		this.props.auth(
			this.state.formControls.email.value,
			this.state.formControls.password.value,
			true
		)
}

	//using Firebase REST API, we create POST request with 3 required params, usin API key from our FB DB settings
	registerHandler = () => {

		this.props.auth(
			this.state.formControls.email.value,
			this.state.formControls.password.value,
			false //bull for isLogin parameter in 'auth' action below
		)
		
	}


	// this metod will prevent standard behaviour of the forms submission until the backend is in place
	submitHandler = event => {
		event.preventDefault()
	}



	//local function to be used in onChangeHandler below
	validateControl (value, validation) {

		//as this is a universal validation control to be used through out the app
		// thus it could be used not only for email and password, but for various forms
		//so this first 'if' is checking whether the field has a validation parameters in props
		//if 'no', then we assume it's valid and we leave the function with 'true' value
		if (!validation) {
			return true
		}

		let isValid = true

		if (validation.required) {
			//trim will remove spaces from the input and check the existance of symbols
			isValid = value.trim() !== '' && isValid
		}

		//using regex validation valid from IS JS library
		if (validation.email) {
			isValid = is.email(value) && isValid
		}

		if (validation.minLength) {
			isValid = value.length >= validation.minLength && isValid
			console.log(this.props)
		}

		return isValid
	}



	// function for onChange method in Input component
	onChangeHandler = (event, controlName) => {

		// Important note: in order to avoid state mutations, we can't change state objects separately,
		// from different places in the app. Thus, here we create a copy of state.
		// We will update this copy in the const FormControls, and replace state with it, after it's been done

		// we create a state copy as indipendent object usins [...] Spread operator. And save it to the variable
		const formControls = {...this.state.formControls}

		//we separate values for email and password, using controlName
		const control = {...formControls[controlName]}

		//then we're defining future state objects which will be then passed on to Input props	
		control.value=event.target.value
		//we set 'touched' to 'true', because if the function onChangeHandler was initiated, 
		//then user has touched the input
		control.touched=true
		//for saving bull value 'valid', we create local function this.validateControl (see above).
		//We pass on control.value which will store the actual user input in real time.
		// and control.validation will store the configuration to check this imput for validity
		control.valid = this.validateControl(control.value, control.validation)

		//now changing state in 2 steps: 
		//1) updating gathered copy objects formControls by key controlName
	
		formControls[controlName]=control

		// also, creating local var for whole form validation
		let isFormValid = true
		//we looping through the formControls state objects in the state copy, and assign 
		//their 'valid' bull field to the local var above
		Object.keys(formControls).forEach(name => {
			isFormValid = formControls[name].valid && isFormValid
		})

		//2) updating state both with new formControl and isFormValid values
		this.setState({
			formControls, isFormValid
		})
	}




	// function for mapping, generating and rendering Input components below. Using state of the Auth component
	renderInputs () {
		return Object.keys(this.state.formControls).map((controlName, index) => {
			const control = this.state.formControls[controlName]
			return (
				<Input
					key={controlName + index}
					type={control.type}
					value={control.value}
					valid={control.valid}
					touched={control.touched}
					label={control.label}
					shouldValidate={!!control.validation}
					errorMessage={control.errorMessage}
					onChange={event => this.onChangeHandler(event, controlName)}

				/>
			)
		})
	}

	render(){
		return (
			<div className={classes.Auth}>
				<div>
					<h1>Авторизация</h1>

					<form onSubmit={this.submitHandler} className={classes.AuthForm}>
						
						{this.renderInputs()}
						

						<Button 
							type="success" 
							onClick={this.loginHandler}
							// based on state condition for disabeling buttons
							disabled={!this.state.isFormValid}> 
							Войти
						</Button>

						<Button 
							type="primary" 
							onClick={this.registerHandler}
							disabled={!this.state.isFormValid}>
							Зарегистрироваться
						</Button>

					</form>
				</div>
			</div>
		)
	}
}


function mapDispatchToProps(dispatch) {
	return {
		auth: (email, password, isLogin) => dispatch(auth(email, password, isLogin))
	}
}

export default connect (null, mapDispatchToProps) (Auth)

