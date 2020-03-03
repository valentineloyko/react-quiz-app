import { CREATE_QUIZ_QUESTION, RESET_QUIZ_CREATION } from "../actions/actionTypes"

const initialState = {
	quiz: []
}

export default function createReducer(state = initialState, action) {
	switch (action.type) {

		case CREATE_QUIZ_QUESTION:
			return{
				...state,
				quiz: [...state.quiz, action.item] //we spread the state.quiz copy to const quiz, add the (item)
				//from the mentioned action, which is this.props.createQuizQuestion(questionItem) passed in QuizCreator container

			}
		
		case RESET_QUIZ_CREATION:
			return{
				...state,
				quiz: []
				
		}


		default:
			return state
		
	}
}