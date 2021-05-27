import React from 'react';
import DependencyChart from './DependencyChart'
import { Provider } from 'react-redux'
import store from './store'

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <DependencyChart />
      </Provider>
    </div>
  );
}

export default App;
