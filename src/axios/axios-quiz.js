import axios from 'axios'

//setting an axios instance with default path to our Firebase DB
//in order to shorten code URLs, e.g. in componentDidMount methods

export default axios.create({
	baseURL: 'https://react-quiz-fba95.firebaseio.com/'
})