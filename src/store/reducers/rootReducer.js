import {combineReducers} from 'redux'
import quizReducer from './quiz'
import createReducer from './create'
import authReducer from './auth'


//we import (above) and combine states from local reducers

export default combineReducers ({
	quiz: quizReducer,
	create: createReducer,
	auth: authReducer
})