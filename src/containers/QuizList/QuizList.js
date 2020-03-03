import React, { Component } from 'react'
import classes from './QuizList.css'
import Loader from '../../components/UI/Loader/Loader'
import {NavLink} from 'react-router-dom'
import {connect} from 'react-redux'
import {fetchQuizes} from '../../store/actions/quiz'


class QuizList extends Component {



	//using Axios API for getting/parcing and storing quizes in local const 'quizes'
	//then we update state 'quizes' with local const quizes from this method
	 componentDidMount() {
		this.props.fetchQuizes()
	 }

	//this render method will return list from updated state, using fields
	// created in componentDidMount (id, name)
	renderQuizes () {
		return this.props.quizes.map(quiz => {
			return(
				<li
				key={quiz.id}>
					<NavLink to={'/quiz/' + quiz.id}> 
						 {quiz.name}
					</NavLink>
				</li>
			)
		})
	}

	render() {
		return (
			<div className={classes.QuizList}>
				<div>
					<h1>Список тестов</h1>

					{/* condition to show loader, if method componentDidMount has not finished the state update yet */}
					{this.props.loading || this.props.quizes.length === 0

						? <Loader/> 
						
						: <ul>
							{this.renderQuizes()}
						</ul>
						}

						
				</div>
			</div>
		)
	}
}


function mapStateToProps(state) {
	return{
		//we refer to this component's state fiels 'quiz' and 'loading' being sent to reducer quiz=>rootReducer=>index.js
		quizes: state.quiz.quizes, 
		loading: state.quiz.loading
	}
}

function mapDispatchToProps(dispatch){
	return{
		fetchQuizes: ()=>dispatch(fetchQuizes()) //metod 'fetchQuizes' will dispatch action 'fetchQuizes'
		}
	}


export default connect(mapStateToProps, mapDispatchToProps)(QuizList)