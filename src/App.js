import {Component} from 'inferno';
import {connect} from "inferno-redux";
import {setFilter} from './actions'
import {getInitialTrainState, startTrainFeed, startTrainTrackingFeed} from './digitrafficClient'
import {getTrainVersion} from "./selectors";
import TrainsByCategoriesContainer from './TrainsByCategoriesContainer';
import TrainInfoPage from './TrainInfoPage'
import TrainTrackingPage from './TrainTrackingPage'

import './trainApp.css';
import {Link, Route, Switch, withRouter} from "inferno-router";


class App extends Component {
    componentDidMount() {
        const store = this.context.store;
        store.dispatch(getInitialTrainState());
        store.dispatch(startTrainFeed());
    }


    render() {
        const {appsettings, trainsVersion} = this.props;
        return (
            <div className="App">
                <div><Link to={'/'}>JUNAT</Link> | <Link to={'/asemat'}>ASEMAT</Link> | <Link
                    to={'/kulkutiedot'}>KULKUTIEDOT</Link></div>
                <div>Junien versio: <span>{trainsVersion}</span></div>
                <Switch>
                    <Route exact path="/" component={TrainsByCategoriesContainer}/>
                    <Route path="/juna/:trainKey" component={TrainInfoPage}/>
                    <Route path="/kulkutiedot" component={TrainTrackingPage}/>
                </Switch>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        appsettings: state.appsettings,
        trainsVersion: getTrainVersion(state)
    };
};

export default withRouter(connect(
    mapStateToProps,
    {setFilter, getInitialTrainState}
)(App));
