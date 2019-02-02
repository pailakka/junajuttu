import {getTrainKeysFromCategory} from "./selectors";
import {connect} from "inferno-redux";
import TrainInfoBox from "./TrainInfoBox";


const TrainsByCategory = ({categoryTrains}) => <div className={'trainInfoBoxContainer'}>
    {categoryTrains.map(tk => <TrainInfoBox trainKey={tk}/>)}
</div>;


const mapStateToProps = (state, {trainCategory}) => {
    return {
        categoryTrains: getTrainKeysFromCategory(state, trainCategory)
    };
};

export default connect(
    mapStateToProps,
    null
)(TrainsByCategory);
