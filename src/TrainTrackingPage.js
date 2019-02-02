import {connect} from "inferno-redux";

import './traininfo.css';
import {getTrains, getTrainTracking} from "./selectors";
import {TrainTrackingTable} from "./TrainTrackingTable";

const TrainTrackingPage = ({trains, trainTracking}) => trainTracking ? <div>
    <h2>Kulkutiedot</h2>
    <TrainTrackingTable trains={trains} trainTracking={trainTracking} />
</div> : <span>Ladataan kulkutietoja...</span>;


const mapStateToProps = (state, {match}) => {
    const trainTracking = getTrainTracking(state);
    const trains = getTrains(state);
    return {
        trainTracking,
        trains
    };
};

export default connect(
    mapStateToProps,
    null
)(TrainTrackingPage);
