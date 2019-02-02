import fetch from 'cross-fetch';
import * as mqtt from 'mqtt';
import * as _ from 'lodash';
import {initTrains, setIsLoading, updateTrains, updateTrainTracking} from "./actions";

export const getTrainKey = (train) => [train.departureDate, train.trainNumber];
export const getTimeTableRowKey = (train, tt) => [train.departureDate, train.trainNumber, tt.stationShortCode];
export const getMinVersionFromTrains = (trains) => {
    let versions = [];
    if (trains.map) {
        versions = trains.map(train => train.version);
    } else {
        versions = [];
        for (const tk in trains) {
            if (!trains.hasOwnProperty(tk)) continue;
            versions.push(trains[tk].version);
        }
    }
    return Math.min(...versions);
};

const handleTrain = (train) => {
    const lastActualTime = _.findLastIndex(train.timeTableRows, 'actualTime');
    train.lastDifferenceInMinutes = lastActualTime > -1 && train.timeTableRows[lastActualTime].differenceInMinutes;
    train.hasCancelledTimetableRow = train.timeTableRows.find(tt => tt.cancelled) !== undefined;
    train.timeTableRows = train.timeTableRows.map((tt, i) => {
        /*
        if (tt.scheduledTime) tt.scheduledTime = parse(tt.scheduledTime);
        if (tt.actualTime) tt.actualTime = parse(tt.actualTime);
        if (tt.liveEstimateTime) tt.liveEstimateTime = parse(tt.liveEstimateTime);

        if (tt.trainReady) tt.trainReady.timestamp = parse(tt.trainReady.timestamp);
        */

        if (i < lastActualTime && !tt.actualTime && tt.liveEstimateTime) {
            tt.actualTime = tt.liveEstimateTime;
        }

        return tt;
    });
    return train;
};

export const getInitialTrainState = () => (dispatch, getState) => {
    const state = getState();
    const currentTrainsVersion = state.trains.trainsVersion;
    dispatch(setIsLoading(true));
    const url = 'https://rata.digitraffic.fi/api/v1/live-trains' + (currentTrainsVersion ? '?version=' + currentTrainsVersion : '');
    fetch(url)
        .then(res => res.json())
        .then(trains => {
            const minVersion = getMinVersionFromTrains(trains);
            console.log('trains', 'minVersion', minVersion);
            if (currentTrainsVersion === null) {
                fetch('https://rata.digitraffic.fi/api/v1/live-trains?version=' + minVersion)
                    .then(res => res.json())
                    .then(trains => {
                        dispatch(initTrains(trains.map(handleTrain).reduce((acc, train) => ({
                            ...acc,
                            [getTrainKey(train)]: train
                        }), {})))
                    })
            }
            dispatch(initTrains(trains.map(handleTrain).reduce((acc, train) => ({
                ...acc,
                [getTrainKey(train)]: train
            }), {})))
        });

    return initTrains({})
};

const trainUpdateBatcher = null;
let trainUpdateBatchSize = 0;
let trainUpdateBatch = {};

let trainTrackingBatchSize = 0;
let trainTrackingBatch = [];

export const startTrainFeed = () => {
    console.log('startTrainFeed', this);
    const client = mqtt.connect('wss://rata.digitraffic.fi/mqtt');

    client.on('connect', function () {
        client.subscribe('trains/#', function (err) {
            if (err) console.error(err);
        })
        client.subscribe('train-tracking/#', function (err) {
            if (err) console.error(err);
        })
    });

    return (dispatch) => {
        if (trainUpdateBatcher === null) {
            setInterval(() => {
                if (trainUpdateBatchSize > 0) {
                    dispatch(updateTrains(trainUpdateBatch));
                    trainUpdateBatchSize = 0;
                    trainUpdateBatch = {};
                }

                if (trainTrackingBatch.length > 0) {
                    dispatch(updateTrainTracking(trainTrackingBatch));
                    trainTrackingBatch = [];
                }

            }, 250);
        }
        client.on('message', function (topic, message) {
            const topicParts = topic.split('/');
            const jsonPayload = JSON.parse(message.toString());
            if (topicParts[0] === 'trains') {
                trainUpdateBatch[getTrainKey(jsonPayload)] = handleTrain(jsonPayload);
                trainUpdateBatchSize++;
            } else if (topicParts[0] === 'train-tracking') {
                trainTrackingBatch.push(jsonPayload);
            }
        });

    }
};
