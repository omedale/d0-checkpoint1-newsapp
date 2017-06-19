import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import NewsActions from '../actions/NewsActions';
import NewsStore from '../stores/NewsStore';
import AuthStore from '../stores/AuthStore';
import Header from './Header';
import Footer from './Footer';
import AuthActions from '../actions/AuthActions';
import SearchBar from './SearchBar';
import LoadingComponent from './LoadingComponent';

/**
 * Create a react component
 * @class Sources
 */
export default class Sources extends React.Component {
  /**
   * Create a constructor
   * @constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      authenticated: AuthStore.isAuthenticated(),
      sources: [],
      filterText: '',
      userName: AuthStore.getUserName(),
      userEmail: AuthStore.getUserEmail(),
    };
    this.searchSource = this.searchSource.bind(this);
    this.onChange = this.onChange.bind(this);
    if (this.state.authenticated === false) {
      this.props.history.push('/login');
    }
  }
  /**
   * executes when the component is mounting
   * Trigger action to fetch news sources
   * @method componentWillMount
   * @return {void} - trigger axious to fetch sources
   */
  componentWillMount() {
    NewsActions.recieveSources();
  }
  /**
   * Add event Listener to the News Store
   * executes when the component is fully mounted
   * @method componentDidMount
   * @return {event} - resgister event
   */
  componentDidMount() {
    NewsStore.addChangeListener(this.onChange);
  }

  /**
   * Remove event listener from the store
   * @method componentWilUnMount
   * @return {event} - removes event
   */
  componentWillUnmount() {
    NewsStore.removeChangeListener(this.onChange);
  }
  /**
   * gets filter sources and set the state
   * @method onChange
   * @return {state} - Set sources to the state
   */
  onChange() {
    this.setState({
      sources: NewsStore.getSources(),
    });
  }
  /**
   * sort type available for news source
   * @method setSortAvailable
   * @param {array} sort
   * @return {state} - Set sort type
   */
  setSortAvailable(sort) {
    localStorage.setItem('omedale_sort_value', JSON.stringify(sort.sortBysAvailable));
  }
 /**
   * gets filter text and set the state
   * @method searchSource
   * @param {string} filterSource
   * @return {state} - Set search text to the state
   */
  searchSource(filterSource) {
    this.setState({
      filterText: filterSource,
    });
  }
/**
   * Render react component
   * @method render
   * @return {function} react-component
   */
  render() {
    let count = 0;
    const newsNode = this.state.sources.map((source) => {
      if (source.name.toString().toLowerCase().indexOf(this.state.filterText.toString().toLowerCase()) === -1) {
        count +=1;
        if (count === this.state.sources.length){
          return <h3  key={source.name}>Ooops!!.... source not found</h3>;
        }
        return '';
      }
      return (
        <li onClick={() => this.setSortAvailable(source)} key={source.name}>
          <Link
            key={source.name}
            to={`/articles/${source.id}`}
          >
            <h3 className="newshead">{source.name}</h3>
            <span className="newsdesc">{source.description.substr(0, 160)}...</span>
          </Link>
        </li>
      );
    });

    return (
      <div>
        <Header history={this.props.history} />
        <div className="ch-container outercontainer">
          <div className="">
            <div className="row">
              <SearchBar
                filterText={this.state.filterText}
                onFilterTextInput={this.searchSource}
              />
            </div>
            <div className="">
              <div className="box-inner">
                <ul className="dashboard-list listpad listcontainer">
                  { newsNode.length > 0 ? newsNode : <LoadingComponent /> }
                </ul>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

Sources.propTypes = {
  history: PropTypes.any.isRequired,
};