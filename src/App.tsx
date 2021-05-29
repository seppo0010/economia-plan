import React from 'react';
import DependencyChart from './DependencyChart'
import DifficultyAssessment from './DifficultyAssessment'
import { Provider } from 'react-redux'
import store from './store'
import Container from '@material-ui/core/Container';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Container maxWidth="lg">
          <DependencyChart />
          <DifficultyAssessment />
        </Container>
      </Provider>
    </div>
  );
}

export default App;
