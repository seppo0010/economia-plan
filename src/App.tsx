import React from 'react';
import DependencyChart from './DependencyChart'
import DifficultyAssessment from './DifficultyAssessment'
import { Provider } from 'react-redux'
import store from './store'

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <DependencyChart />
        <DifficultyAssessment />
      </Provider>
    </div>
  );
}

export default App;
