import {getTrainKey} from "./digitrafficClient";
import {Link} from "inferno-router";
import {TimeFormatter} from "./utils";


export const TrainTrackingTable = ({trains, trainTracking}) => <table>
    <thead>
    <tr>
        <th colSpan={2}>&nbsp;</th>
        <th colSpan={2}>Liikennepaikka</th>
        <th colSpan={2}>&nbsp;</th>
    </tr>
    <tr>
        <th>Juna</th>
        <th>Aika</th>
        <th>Nykyinen</th>
        <th>Seuraava</th>
        <th>Riadeosuus</th>
        <th>Tapahtuma</th>
    </tr>
    </thead>
    <tbody>
    {trainTracking.map(tt => <tr>
        <td>{trains ? (trains[getTrainKey(tt)] ? <Link to={`juna/${getTrainKey(tt)}`}>{tt.trainNumber}</Link> : <span>{tt.trainNumber}</span>) : <span>{tt.trainNumber}</span>}</td>
        <td><TimeFormatter td={tt.timestamp}/></td>
        <td>{tt.station}</td>
        <td>{tt.nextStation}</td>
        <td>{tt.trackSection}</td>
        <td>{tt.type}</td>
    </tr>)}
    </tbody>
</table>
