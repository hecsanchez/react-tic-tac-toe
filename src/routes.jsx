import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Controls
import NotFound from './components/controls/NotFound/NotFound';

// Pages
import Home from './components/pages/Home';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);
