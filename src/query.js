import SelectionSet from './selection-set';
import join from './join';

function parseArgs(args) {
  let name;
  let variables;
  let selectionSetCallback;

  if (args.length === 3) {
    [name, variables, selectionSetCallback] = args;
  } else if (args.length === 2) {
    if (Object.prototype.toString.call(args[0]) === '[object String]') {
      name = args[0];
      variables = null;
    } else if (Array.isArray(args[0])) {
      variables = args[0];
      name = null;
    }

    selectionSetCallback = args[1];
  } else {
    selectionSetCallback = args[0];
    name = null;
  }

  return {name, variables, selectionSetCallback};
}

class VariableDefinitions {
  constructor(variableDefinitions) {
    this.variableDefinitions = variableDefinitions || [];
  }

  toString() {
    if (this.variableDefinitions.length === 0) {
      return '';
    }

    const variableDefinitionsStrings = this.variableDefinitions.map((variableDefinition) => {
      return variableDefinition.toVariableDefinitionString();
    });

    return ` (${join(variableDefinitionsStrings)}) `;
  }
}

export default class Query {
  constructor(typeBundle, ...args) {
    const {name, variables, selectionSetCallback} = parseArgs(args);

    this.typeBundle = typeBundle;
    this.name = name;
    this.variableDefinitions = new VariableDefinitions(variables);
    this.selectionSet = new SelectionSet(typeBundle, 'QueryRoot', selectionSetCallback);
  }

  get isAnonymous() {
    return !this.name;
  }

  toString() {
    const nameString = (this.name) ? ` ${this.name}` : '';

    return `query${nameString}${this.variableDefinitions.toString()}${this.selectionSet.toString()}`;
  }
}
