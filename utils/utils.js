const moveRemove = (path, globDef) => {
    let globResult = "";
    if (globDef.indexOf('!') > -1) {
        globResult = `!${path}/${globDef.replace('!', '')}`;
    } else {
        globResult = `${path}/${globDef}`;
    }
    return globResult;
};

const toGlobArray = ({js_glob, src_path}) => {
    let jsGlob;
    if (Array.isArray(js_glob)) {
        jsGlob = js_glob.map((jGlob) => (moveRemove(src_path, jGlob)));
    } else {
        jsGlob = moveRemove(src_path, js_glob);
    }
    return jsGlob;
};

module.exports = {moveRemove, toGlobArray};
