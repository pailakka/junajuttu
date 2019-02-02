export const setFilter = filter => ({type: 'set-filters', payload: {filter}});
export const setIsLoading = isLoading => ({type: 'set-isloading', payload: {isLoading}});
export const initTrains = trains => ({type: 'init-trains', payload: trains});
export const updateTrains = trains => ({type: 'update-trains', payload: trains});
export const updateTrainTracking = trainTracking => ({type: 'update-train-tracking', payload: trainTracking});
