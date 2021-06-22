import React from 'react';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';

function Welcome() {
  return (
    <div>
      <h2>Bienvenide</h2>
      <p>En esta página vamos a tratar de ver en qué materia te conviene anotarte para terminar el C.P.C. de derecho en la menor cantidad de cuatrimestes.</p>
      <p>Functiona a través de hacer simulaciones de reusltados de finales y buscar la mejor variante a través de un <a href="https://es.wikipedia.org/wiki/Algoritmo_gen%C3%A9tico" target="_blank" rel="noreferrer">algoritmo genético.</a></p>
      <p>No siempre garantiza los mejores resultados, pero es una decente aproximación.</p>
      <Link component={Button} to="/approved">Empezar</Link>
    </div>
  )
}
export default Welcome
