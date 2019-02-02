import {connect} from "inferno-redux";
import classNames from 'classnames';

import {getTrainByKey} from "./selectors";
import {Link} from "inferno-router";
import {getTrainKey} from "./digitrafficClient";
import {TrainNumber} from "./TrainNumber";


const TrainInfoBox = ({train}) => <Link to={`juna/${getTrainKey(train)}`}>
    <div className={classNames('trainInfoBox', {
        'train-running':train.runningCurrently,
        'train-cancelled':train.cancelled,
        'train-partcancelled':train.hasCancelledTimetableRow,
        'train-late':train.lastDifferenceInMinutes > 7
    })}>
        <TrainNumber train={train}/>
    </div>
</Link>;


const mapStateToProps = (state, {trainKey}) => {
    return {
        train: getTrainByKey(state, trainKey)
    };
};

export default connect(
    mapStateToProps,
    null
)(TrainInfoBox);


