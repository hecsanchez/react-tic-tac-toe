import React, { Component } from 'react';
import PropTypes from 'prop-types';


const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  image: {
    top: '23vh',
    position: 'absolute',
    right: 0,
  }
});

const NotFound = (props) => {
  const { classes } = props;
  return (
    <div>
      <h1>Whoops</h1>
      <h2>La página que estás buscando no existe</h2>
      <p>Regresa al <a href="/">Home</a></p>
    </div>
  );
}

NotFound.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default NotFound;
