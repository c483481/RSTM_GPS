interface PubsubEvent {
    updateTruckLocation: symbol;
}

export const pubsubEvent: PubsubEvent = {
    updateTruckLocation: Symbol("updateTruckLocation"),
};
