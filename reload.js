const fs = require('fs');
const yaml = require('js-yaml');

const read = (path) => {
    const file = fs.readFileSync(path);
    return yaml.safeLoad(file);
};

const write = (path, object, kwargs) => {
    const file = yaml.safeDump(object, kwargs);
    fs.writeFileSync(path, file);
}

const componentsName = 'components.yaml';
const components = read(componentsName);
write(componentsName, components, {flowLevel: 2});

const compoundsName = 'compounds.yaml';
const compounds = read(compoundsName);
const compoundList = Object.entries(compounds);
let sorted = {};
while (compoundList.length > 0) {
    let [compound, compoundData] = compoundList.shift();
    let {operandList} = compoundData;
    if (operandList.every(x => (x in components || x in sorted))) {
        sorted[compound] = compoundData;
    } else {
        compoundList.push([compound, compoundData]);
    }
}

write(compoundsName, sorted, {flowLevel: 1});
