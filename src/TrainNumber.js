export const TrainNumber = ({train}) => <span>{train.commuterLineID ? train.commuterLineID : train.trainType} {train.trainNumber}</span>;
