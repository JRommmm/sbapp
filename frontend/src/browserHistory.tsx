import { History, createBrowserHistory } from 'history';
   
/* If using Typescript, you can make this object Readonly as follows */
export type ReadonlyBrowserHistory = Readonly<History>
const browserHistory: ReadonlyBrowserHistory = createBrowserHistory();

export default browserHistory;