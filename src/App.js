import React from 'react';
import './App.css';
import Header from './components/Header';
import Contact from './components/Contact';
import Title from './components/Title';
import Layout from './components/Layout';


function App() {
  return (
    <div className="App">
      <Header />
      <Title />
      <Layout/>
      <Contact />
    </div>
  );
}

export default App;
