import {connect} from "inferno-redux";
import * as _ from 'lodash';
import {parse} from 'date-fns';

import {getTrainByKey, getTrainTrackingByKey} from "./selectors";
import {TrainNumber} from "./TrainNumber";

import './traininfo.css';
import {TimeFormatter} from "./utils";
import {TrainTrackingTable} from "./TrainTrackingTable";


const TimetableRowType = ({trainStopping, type}) => <span>{trainStopping ? type : 'PASSES'}</span>;

const timetableRowDeduplicateKey = (tt) => [tt.stationShortCode, tt.trainStopping && tt.type].toString();

const TrainReady = (trainReady) => <span>{trainReady.accepted &&
<span>Lähtövalmius <TimeFormatter td={trainReady.timestamp}/></span>}</span>;
const TrainCauses = ({causes}) =>
    <span>{causes.map(c => `${c.categoryCode} / ${c.detailedCategoryCode}`).join(' | ')}</span>;



const TrainInfoPage = ({train, trainTracking}) => train ? <div>
    <h2><TrainNumber train={train}/></h2>
    <table>
    </table>

    <table>
        <thead>
        <tr>
            <th>Lkp</th>
            <th>Raide</th>
            <th>Tyyppi</th>
            <th>Aikataulu</th>
            <th>Ennuste / toteuma</th>
            <th>Ero</th>
            <th>Info</th>
        </tr>
        </thead>
        <tbody>
        {_.reject(train.timeTableRows, (tt, i) => i > 0 && timetableRowDeduplicateKey(train.timeTableRows[i - 1]) === timetableRowDeduplicateKey(tt)).map(tt =>
            <tr className={!tt.commercialStop && 'timetablerow-noncommercial'}>
                <td>{tt.stationShortCode}</td>
                <td>{tt.commercialTrack}</td>
                <td><TimetableRowType {...tt}/></td>
                <td><TimeFormatter td={tt.scheduledTime}/></td>
                <td>{tt.actualTime ? <TimeFormatter td={tt.actualTime}/> : tt.liveEstimateTime &&
                    <TimeFormatter td={tt.liveEstimateTime} className={'timetablerow-estimated'}/>}</td>
                <td>{tt.differenceInMinutes !== 0 && tt.differenceInMinutes}</td>
                <td>{tt.trainReady && <TrainReady {...tt.trainReady} />} {tt.causes.length > 0 &&
                <TrainCauses causes={tt.causes}/>}</td>
            </tr>)}
        </tbody>
    </table>
    <h3>Kulkutiedot</h3>
    {trainTracking && <TrainTrackingTable trainTracking={trainTracking} />}
</div> : <span>Ladataan junia...</span>;


const mapStateToProps = (state, {match}) => {
    const train = getTrainByKey(state, match.params.trainKey);
    const trainTracking = getTrainTrackingByKey(state, match.params.trainKey);
    return {
        train,
        trainTracking
    };
};

export default connect(
    mapStateToProps,
    null
)(TrainInfoPage);
