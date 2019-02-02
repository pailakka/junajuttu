import {parse} from "date-fns";

export const TimeFormatter = (props) => <span {...props}>{parse(props.td).toLocaleTimeString()}</span>;
