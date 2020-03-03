import React, {Component} from 'react';
import {connect} from 'react-redux'
import Layout from './hoc/Layout/Layout'
import {Route, Switch, Redirect, withRouter} from 'react-router-dom'
import Quiz from './containers/Quiz/Quiz.js'
import QuizList from './containers/QuizList/QuizList.js'
import QuizCreator from './containers/QuizCreator/QuizCreator.js'
import Auth from './containers/Auth/Auth.js'
import Logout from './components/Logout/Logout'
import {autoLogin} from './store/actions/auth'

class App extends Component {

  componentDidMount(){
    this.props.autoLogin()
  }
  render(){

    let routes=(
      
      <Switch>
          <Route path="/auth" component={Auth}/>
          {/* here we put dinamic :id path */}
          <Route path="/quiz/:id" component={Quiz}/> 
          <Route path="/" exact component={QuizList}/>
          <Redirect to='/' />
      </Switch>
    )    
  
    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/auth" component={Auth}/>
          <Route path="/quiz-creator" component={QuizCreator}/>
          {/* here we put dinamic :id path */}
          <Route path="/quiz/:id" component={Quiz}/> 
          <Route path="/logout" component={Logout}/>
          <Route path="/" exact component={QuizList}/>
          <Redirect to='/' />
      </Switch>
      )
    }

  return (
    <Layout>
      
        {routes}
    
    </Layout>
  );
  }
}

function mapStateToProps(state){
  return{
    isAuthenticated: !!state.auth.token //we take token created in Auth action and put it to bullean value using !!
  }
}

function mapDispatchToProps(dispatch){
  return{
   autoLogin: ()=>dispatch(autoLogin())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
