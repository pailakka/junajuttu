import {getMinVersionFromTrains, getTimeTableRowKey, getTrainKey} from "../digitrafficClient";
import * as _ from "lodash";

const initialState = {
    trains: {},
    trainKeysByCategory: {},
    trainCategories: [],
    trainsVersion: null,
    timetablesByStation: {},
    trainTracking: [],
    trainTrackingByTrain: {}
};


const getTrainKeysByCategory = (trains) => {
    const trainKeysByCategory = {};
    for (const tk in trains) {
        if (!trains.hasOwnProperty(tk)) continue;
        const train = trains[tk];
        if (!trainKeysByCategory[train.trainCategory]) {
            trainKeysByCategory[train.trainCategory] = [];
        }

        trainKeysByCategory[train.trainCategory].push(tk);
    }
    return trainKeysByCategory;
};

const getTimetablesByStation = (trains) => {
    const ttByStation = {};
    for (const tk in trains) {
        if (!trains.hasOwnProperty(tk)) continue;

        const train = trains[tk];

        train.timeTableRows.map(tt => {
            tt.trainKey = getTrainKey(train);
            if (ttByStation[tt.stationShortCode] === undefined) ttByStation[tt.stationShortCode] = {};
            if (ttByStation[tt.stationShortCode][getTimeTableRowKey(train, tt)] === undefined) ttByStation[tt.stationShortCode][getTimeTableRowKey(train, tt)] = [];
            ttByStation[tt.stationShortCode][getTimeTableRowKey(train, tt)].push(tt);
        })

    }
    return ttByStation;
};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'init-trains': {

            const trains = {...state.trains, ...action.payload};
            const trainKeysByCategory = getTrainKeysByCategory(trains);
            const timetablesByStation = _.merge(state.timetablesByStation, getTimetablesByStation(trains));

            return {
                ...state,
                trains,
                trainKeysByCategory,
                timetablesByStation,
                trainCategories: Object.keys(trainKeysByCategory),
                trainsVersion: getMinVersionFromTrains(action.payload)
            };
        }
        case 'update-trains': {

            const trains = {...state.trains, ...action.payload};
            const trainKeysByCategory = getTrainKeysByCategory(trains);
            const timetablesByStation = _.merge(state.timetablesByStation, getTimetablesByStation(trains));

            return {
                ...state,
                trains,
                trainKeysByCategory,
                timetablesByStation,
                trainCategories: Object.keys(trainKeysByCategory),
                trainsVersion: getMinVersionFromTrains(action.payload)
            };
        }
        case 'update-train-tracking': {
            const trainTracking = state.trainTracking.concat(action.payload);
            const trainTrackingByTrain = state.trainTrackingByTrain;

            action.payload.forEach(trainTracking => {
                const tk = [trainTracking.departureDate, trainTracking.trainNumber];
                if (trainTrackingByTrain[tk] === undefined) trainTrackingByTrain[tk] = [];
                trainTrackingByTrain[tk].push(trainTracking);
            });


            for (const ttk in trainTrackingByTrain) {
                if (!trainTrackingByTrain.hasOwnProperty(ttk)) continue;
                trainTrackingByTrain[ttk] = trainTrackingByTrain[ttk].slice(0, 10);
            }

            console.log('trainTrackingByTrain', trainTrackingByTrain);
            return {
                ...state,
                trainTracking: trainTracking.slice(trainTracking.length - 100),
                trainTrackingByTrain
            };
        }
        default:
            return state;
    }
}
