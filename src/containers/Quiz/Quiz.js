import React, {Component} from 'react'
import classes from './Quiz.css'
import ActiveQuiz from '../ActiveQuiz/ActiveQuiz'
import FinishedQuiz from '../../components/FinishedQuiz/FinishedQuiz'
import Loader from '../../components/UI/Loader/Loader'
import { connect } from 'react-redux'
import {fetchQuizById, quizAnswerClick, retryQuiz} from '../../store/actions/quiz'

class Quiz extends Component {



onAswerClickHandler = answerId => {
	this.props.quizAnswerClick(answerId)
}


async componentDidMount () {
	this.props.fetchQuizById(this.props.match.params.id) //passing quiz id from url to redux function/action using routing props
}

componentWillUnmount () {
	this.props.retryQuiz()
}

// here we render our state-full countainer component 'Quiz' 
// and give properties to a next-level ActiveQuiz component in it

	render(){
		return (
			
			<div className={classes.Quiz}>
				<div className={classes.QuizWrapper}>
					<h1>Ответьте на все вопросы</h1>
					{
						this.props.loading || !this.props.quiz // 'or' conditions for 

						? <Loader />

						: this.props.isFinished
							? <FinishedQuiz
								results={this.props.results}
								quiz={this.props.quiz}
								onRetry={this.props.retryQuiz}
							/>
							:
								<ActiveQuiz 
								question={this.props.quiz[this.props.activeQuestion].question}
								answers={this.props.quiz[this.props.activeQuestion].answers} 
								onAnswerClick={this.onAswerClickHandler}
								quizLength={this.props.quiz.length}
								answerNumber={this.props.activeQuestion + 1}
								state={this.props.answerState}/>
								
					}
					
				</div>
			</div>
			)
	}
	}	

function mapStateToProps(state) {
	//we return default state indicated in reducer Quiz.js
	return {
		results: state.quiz.results,
		isFinished: state.quiz.isFinished,
		activeQuestion: state.quiz.activeQuestion,
		answerState: state.quiz.answerState, 
		quiz:state.quiz.quiz,
		loading: state.quiz.loading
	}
}

function mapDispatchToProps(dispatch) {
	return {
		fetchQuizById: id => dispatch(fetchQuizById(id)),
		quizAnswerClick: answerId => dispatch(quizAnswerClick(answerId)),
		retryQuiz: () => dispatch(retryQuiz())
	}
}


export default connect(mapStateToProps, mapDispatchToProps) (Quiz)