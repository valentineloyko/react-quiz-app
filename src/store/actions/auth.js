import axios from 'axios'
import { AUTH_SUCCESS, AUTH_LOGOUT } from './actionTypes'


export function auth(email, password, isLogin) {
	return async dispatch => {

		const authData = {
			email, password, returnSecureToken: true //Firebase necessary parameter for 'post' 
		}

		let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBTEz7p9yvoBZe_YNKeQzeVBBoTuT5i-n0'
		
		if (isLogin) {
			url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBTEz7p9yvoBZe_YNKeQzeVBBoTuT5i-n0'
		}
		const response = await axios.post(url, authData)
		const data = (response.data) // putting server response in separate const

		//creating expiration time using Data JS constructor and session valur from Firebase from data.expiresIn
		const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000)

		//putting user tokenId, userID and Expiration Date from Firebase response in response.data
		//in localStorage using setItem method, which accepts item name and where to get the value
		localStorage.setItem('token', data.idToken)
		localStorage.setItem('userID', data.localId)
		localStorage.setItem('expirationDate', expirationDate)
		
		dispatch(authSuccess(data.idToken))
		dispatch(autoLogout(data.expiresIn))

	
		
	}	
}

export function autoLogout(time) {
	return dispatch => {
		setTimeout(()=>{
			dispatch(logout())
		}, time * 1000)
	}
}

//cleaning up local storage after auth action above
export function logout() {
	localStorage.removeItem('token')
	localStorage.removeItem('userID')
	localStorage.removeItem('expirationDate')
	return{
		type: AUTH_LOGOUT
	}
}

export  function autoLogin() {
	return dispatch => {
		const token = localStorage.getItem('token')
		if(!token){
			dispatch(logout())
		}else{
			const expirationDate = new Date(localStorage.getItem('expirationDate'))
			if(expirationDate <= new Date()){
				dispatch(logout())
			}else{
				dispatch(authSuccess(token))
				dispatch(autoLogout((expirationDate.getTime()-new Date().getTime()) / 1000))
			}
		}
	}
}

export function authSuccess(token) {
	return {
		type: AUTH_SUCCESS,
		token
	}
}