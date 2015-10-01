function merge(source, target) {
    for(var p in source) if(target && !target.hasOwnProperty(p)) target[p] = source[p];
    return target;
}

