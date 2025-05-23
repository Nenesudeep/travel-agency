export {default as NavItems} from './NavItems'; // exporting all the components
export {default as Header} from './Header'; // exporting all the components
export {default as StatsCard} from './StatsCard';
export {default as TripCard} from './TripCard'

declare interface StatsCard {
    headerTitle : string;
    total: number;
    lastMonthCount: number;
    currentMonthCount: number;
}