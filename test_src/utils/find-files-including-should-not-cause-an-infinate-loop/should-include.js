import lib from './lib';
import circular from './circular-include';

export default () => {
    lib('wrapped');
    circular();
};



