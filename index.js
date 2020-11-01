const path =  require('path');
const visit  = require('unist-util-visit');
const { link, text, tableCell, tableRow, table, html } = require('mdast-builder');

const defaultConfiguration = {
    property: 'parent',
};

const createChildRequirementsTable = (requirement, childRequirements) => {
    const tableRows = childRequirements.map(childRequirement => {
        const relativeLink = path.relative(path.parse(requirement.file).dir, childRequirement.file);
        const { id, synopsis = '' } = childRequirement;

        return tableRow([
            tableCell(link(relativeLink, id, text(id))),
            tableCell(text(synopsis)),
        ]);
    });

    const tableHeaderRow = tableRow([
        tableCell(text('Requirement')),
        tableCell(text('Synopsis')),
    ]);

    return [
        html('<div class="tracey tracey-plugin-childrequirements">'),
        table([null, null], [tableHeaderRow, ...tableRows]),
        html('</div>'),
    ];
};

const updateChildrequirements = (original, childRequirements) => {
    const requirement = { ...original };
    const childRequirementsTable = createChildRequirementsTable(requirement, childRequirements);
    let shouldAddChildRequirementsToBottom = true;

    visit(requirement.ast, 'html', (node, index, parent) => {
        if (node.value === '<div class="tracey tracey-plugin-childrequirements">' && parent) {
            parent.children.splice(index, childRequirementsTable.length, ...childRequirementsTable);
            shouldAddChildRequirementsToBottom = false;
        }
    });

    if (shouldAddChildRequirementsToBottom) {
        requirement.ast.children.push(...childRequirementsTable);
    }

    return requirement;
};

const removeChildrequirements = (original) => {
    const requirement = { ...original };

    visit(requirement.ast, 'html', (node, index, parent) => {
        if (node.value === '<div class="tracey tracey-plugin-childrequirements">' && parent) {
            parent.children.splice(index, 3);
        }
    });

    return requirement;
};

const plugin = (configuration = defaultConfiguration) => ({ requirements, tracelinks, annotations }) => {
    const updatedRequirements = requirements.map(theRequirement => {
        const childRequirements = requirements.filter(aRequirement => Object.prototype.hasOwnProperty.call(aRequirement, configuration.property) && aRequirement.parent === theRequirement.id);

        if (childRequirements.length) {
            return updateChildrequirements(theRequirement, childRequirements);
        }

        return removeChildrequirements(theRequirement);
    });

    const updatedTracelinks = tracelinks.map(theTracelink => {
        const updatedRequirement = updatedRequirements.find(theRequirement => theRequirement.id === theTracelink.destination.id);

        return {
            destination: updatedRequirement,
            annotation: theTracelink.annotation,
        };
    });

    return {
        requirements: updatedRequirements,
        tracelinks: updatedTracelinks,
        annotations,
    };
};

module.exports = {
    plugin,
};
