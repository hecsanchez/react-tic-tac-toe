import { connect } from 'react-redux';
import View from './Home';

function mapStateToProps() { return { }}

function mapDispatchToProps() { return { }}

const Home = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);

export default Home;
