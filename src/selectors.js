export const getTrainState = store => store.trains.trains;
export const getTrainTrackingState = store => store.trains.trainTracking;
export const getTrainTrackingByTrainState = store => store.trains.trainTrackingByTrain;
export const getTrainVersion = store => store.trains.trainsVersion;
export const getTrainKeysByCategory = store => store.trains.trainKeysByCategory;
export const getTrainCategories = store => store.trains.trainCategories;
export const getTrainsByCategory = store => store.trains.trainCategories;

export const getTrains = store => getTrainState(store) ? getTrainState(store) : {};
export const getTrainTracking = store => getTrainTrackingState(store) ? getTrainTrackingState(store) : {};
export const getTrainTrackingByTrain = store => getTrainTrackingByTrainState(store) ? getTrainTrackingByTrainState(store) : {};

export const getTrainByKey = (store, trainKey) => getTrains(store)[trainKey];
export const getTrainTrackingByKey = (store, trainKey) => getTrainTrackingByTrain(store)[trainKey];

export const getTrainKeysFromCategory = (store, trainCategory) => {
    return getTrainKeysByCategory(store) ? getTrainKeysByCategory(store)[trainCategory] : [];

};

export const getTrainsByKey = (store, key) =>
    getTrainState(store) ? {...getTrainState(store)[key], key} : {};
