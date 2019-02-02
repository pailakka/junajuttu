const initialState = {
    filters: {},
    isLoading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'set-filters': {
            console.log('set-filters',action);
            const {filters} = action.payload;
            return {
                ...state,
                filters: {...state.filters, ...filters}
            };
        }
        case 'set-is-loading': {
            return {
                ...state,
                ...action.payload
            };
        }
        default:
            return state;
    }
};
