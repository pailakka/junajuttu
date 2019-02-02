import {getTrainCategories} from "./selectors";
import {connect} from "inferno-redux";
import TrainsByCategory from "./TrainsByCategory";


const TrainsByCategoriesContainer = ({trainCategories}) => <div>
    {trainCategories.map(trainCategory =>
        <div>
            <h2>{trainCategory}</h2>
            <TrainsByCategory trainCategory={trainCategory} />
        </div>
    )}
    </div>;



const mapStateToProps = state => {
    return {
        trainCategories: getTrainCategories(state)
    };
};

export default connect(
    mapStateToProps,
    null
)(TrainsByCategoriesContainer);
