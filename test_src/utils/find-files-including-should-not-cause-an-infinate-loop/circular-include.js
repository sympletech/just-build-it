import shouldInclude from './should-include';
console.log('only a tool would do this');

export default () => {
    console.log('circular');
    shouldInclude();
};
