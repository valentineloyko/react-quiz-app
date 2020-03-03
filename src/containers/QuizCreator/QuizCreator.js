import React, { Component } from 'react'
import classes from './QuizCreator.css'
import Button from '../../components/UI/Button/Button'
import {createControl, validate, validateForm} from '../../form/formFramework'
import Input from '../../components/UI/Input/Input'
import Select from '../../components/UI/Select/Select'
import Auxiliary from '../../hoc/Auxiliary/Auxiliary'
import {connect} from 'react-redux'
import {createQuizQuestion, finishCreateQuiz} from '../../store/actions/create'


//local function to shorten repetetive 'config' and 'validation' passing to createControl function
// from formFramework, while listing Option1,2,3,4 in state
function createOptionControl (number) {
	return createControl({
		//we're passing 'config' argument to the createControl func from formFramework.js
		label: `Вариант ${number}`,
		errorMessage: 'Значение не может быть пустым',
		id: number
		},
		// passing 'validation' argument to the createControl func from formFramework.js
		{required: true})
}


//function to initiate state reset for setting question and options each time
function createFormControls () {
	return {

		question: createControl(
			{
			//we're passing 'config' argument to the createControl func from formFramework.js
			label: 'Введите вопрос',
			errorMessage: 'Вопрос не может быть пустым'
			},
			// passing 'validation' argument to the createControl func from formFramework.js
			{required: true}
			
		),

		option1: createControl(
			{
			//passing 'config' argument to the createControl func from formFramework.js
			label: 'Вариант 1',
			errorMessage: 'Значение не может быть пустым',
			id: 1
			},
			
			// passing 'validation' argument to the createControl func from formFramework.js
			{required: true}
		),
		
		option2: createControl(
			{
			//passing 'config' argument to the createControl func from formFramework.js
			label: 'Вариант 2',
			errorMessage: 'Значение не может быть пустым',
			id: 2
			},
			// passing 'validation' argument to the createControl func from formFramework.js
			{required: true}
		),

		//to avoid repetetive config and validation passing to createControl, we use
		//a wrapping function createOptionControl above, accepting {number} as argument
		//it will return createOptionControl in itself
		option3: createOptionControl(3),

		option4: createOptionControl(4)

	}
}


class QuizCreator extends Component {

	state = {

		// value to be used in Select
		rightAnswerId: 1,

		//value for validation
		isFormValid: false,

		//array for storing quiz questions and answer options from input --> removed to Redux state

		//types of form controls/inputs with their starting states removed to functione createFormControls above
		formControls: createFormControls()
	}


	
	// cancelling form standard behaviour in this method untill the backend is ready
	submitHandler = event => {
		event.preventDefault()
	}

	// handler to add new question and answer options to state, after all the inputs are complete

	addQuestionHandler = event => {
		
		//destructurizing and copying formControls inputs from state
		const {question, option1, option2, option3, option4} = this.state.formControls

		//creating temporary const for storing inputs from formControls copy above
		const questionItem = {
			question: question.value,
			id: this.props.quiz.length + 1,
			rightAnswerId: this.state.rightAnswerId,
			answers: [
				{text: option1.value, id: option1.id},
				{text: option2.value, id: option2.id},
				{text: option3.value, id: option3.id},
				{text: option4.value, id: option4.id}
			]
		}

		this.props.createQuizQuestion(questionItem) //calling the action to set state for 'quiz'

		this.setState({
			rightAnswerId: 1,
			isFormValid: false,
			formControls: createFormControls()

		})
	}

	// this method creates new quiz in Firebase DB using Axios library for json
	createQuizHandler = (event) => {
		event.preventDefault()

		//sending created quiz to server DB into quizes table. Logs server's response usin 'then'
		//and error, if any, using 'catch'. 'Await' will parce server promise and put it as an object to the const 'response'
		// also, setting state to default at the end
			 
			this.setState({
				quiz: [],
				rightAnswerId: 1,
				isFormValid: false,
				formControls: createFormControls()
			})
			this.props.finishCreateQuiz()
		

		//another option to write:
		// axios.post('https://react-quiz-fba95.firebaseio.com/quizes.json', this.state.quiz)
		// .then(response => {
		// 	console.log(response)}
		// 	)
		// .catch(error => {
		// 	console.log(error)
		// })
	}

	//validation handler just as in Auth.js
	changeHandler = (value, controlName) => {
		const formControls = { ...this.state.formControls } //spreading the state copy
		const control = { ...formControls[controlName] }

		control.touched = true
		control.value = value //assigning in-coming parameter value (typed by user) to control's value
		control.valid = validate(control.value, control.validation) //func validate from formFramewrok.js

		formControls[controlName]=control

		this.setState({
			formControls: formControls,
			isFormValid: validateForm(formControls) // func validateForm from formFramewrok.js for the whole form validation
		})

	}

	//enable select options by converting user select clicks to number with '+' operator
	selectChangeHandler = event => {
		this.setState({
			rightAnswerId: +event.target.value
		}) 
	}

	// iterating, maping and rendering of inputs (based on this component state - either 'question' or 'option')
	renderControls () {
		return Object.keys(this.state.formControls).map((controlName, index) => {
			const control = this.state.formControls[controlName]

			return (
				<Auxiliary key={controlName+index}>
					<Input
						label={control.label}
						value={control.value}
						valid={control.valid}
						shouldValidate={!!control.validation}/* !! will but the validation state whatever it is to bull value */
						touched={control.touched}
						errorMessage={control.errorMessage}
						onChange={event => this.changeHandler(event.target.value, controlName)}
						
					/>
					{/* condition for puttinh <hr> after first input element ('question) */}
					{index === 0 ? <hr/> : null}
				</Auxiliary>
			)
		})
	}



	render() {
		//creating constant out of Select UI component
		const select = <Select
		label="Выберите правильный ответ"
		value={this.state.rightAnswerId}
		onChange={this.selectChangeHandler}
		options = {[
			{text:1, value: 1},
			{text:2, value: 2},
			{text:3, value: 3},
			{text:4, value: 4}
		]}
		/>

		return (
			<div className={classes.QuizCreator}>
				<div>
				<h1>Создание теста</h1>

				<form onSubmit={this.submitHandler}>
					
					{this.renderControls()}

					{select}

					<Button
						type="primary"
						onClick={this.addQuestionHandler}
						disabled={!this.state.isFormValid}>
						Добавить вопрос
					</Button>

					<Button
						type="success"
						onClick={this.createQuizHandler}
						disabled={this.props.quiz.length === 0}>
						Создать тест
					</Button>

				</form>

				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	//we return default state indicated in reducer Quiz.js
	return {
		quiz: state.create.quiz
	}
}

function mapDispatchToProps(dispatch) {
	return {
		createQuizQuestion: item => dispatch(createQuizQuestion(item)),
		finishCreateQuiz: () => dispatch(finishCreateQuiz())
	}
}

export default connect (mapStateToProps, mapDispatchToProps) (QuizCreator)