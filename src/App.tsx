import React from 'react';
import DependencyChart from './DependencyChart'
import DifficultyAssessment from './DifficultyAssessment'
import InscriptionRecommendation from './InscriptionRecommendation'
import { Provider } from 'react-redux'
import store from './store'
import Container from '@material-ui/core/Container';
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Container maxWidth="lg">
            <Switch>
              <Route exact path="/">
                <DependencyChart />
              </Route>
              <Route exact path="/difficulty">
                <DifficultyAssessment />
              </Route>
              <Route exact path="/recommendation">
                <InscriptionRecommendation />
              </Route>
            </Switch>
          </Container>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
