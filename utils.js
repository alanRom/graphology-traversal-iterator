"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNeighborsForNode = exports.getTraversalModeFromString = exports.TraversalModes = exports.TraversalRecord = void 0;
exports.capitalize = capitalize;
class TraversalRecord {
    constructor(node, attr, depth) {
        this.node = node;
        this.attributes = attr;
        this.depth = depth;
    }
}
exports.TraversalRecord = TraversalRecord;
function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
}
var TraversalModes;
(function (TraversalModes) {
    TraversalModes[TraversalModes["In"] = 0] = "In";
    TraversalModes[TraversalModes["Out"] = 1] = "Out";
    TraversalModes[TraversalModes["Inbound"] = 2] = "Inbound";
    TraversalModes[TraversalModes["Outbound"] = 3] = "Outbound";
    TraversalModes[TraversalModes["Directed"] = 4] = "Directed";
    TraversalModes[TraversalModes["Undirected"] = 5] = "Undirected";
})(TraversalModes || (exports.TraversalModes = TraversalModes = {}));
const getTraversalModeFromString = (mode) => {
    switch (mode.toLowerCase()) {
        case 'in':
            return TraversalModes.In;
        case 'out':
            return TraversalModes.Out;
        case 'inbound':
            return TraversalModes.Inbound;
        case 'directed':
            return TraversalModes.Directed;
        case 'undirected':
            return TraversalModes.Undirected;
        case 'outbound':
            return TraversalModes.Outbound;
        default:
            throw new Error('graphology-traversal/dfs: unsupported traversal mode.');
    }
};
exports.getTraversalModeFromString = getTraversalModeFromString;
const getNeighborsForNode = (graph, node, traversalMode) => {
    switch (traversalMode) {
        case TraversalModes.In:
            return graph.inNeighborEntries(node);
        case TraversalModes.Out:
            return graph.outNeighborEntries(node);
        case TraversalModes.Inbound:
            return graph.inboundNeighborEntries(node);
        case TraversalModes.Directed:
            return graph.directedNeighborEntries(node);
        case TraversalModes.Undirected:
            return graph.undirectedNeighborEntries(node);
        case TraversalModes.Outbound:
        default:
            return graph.outboundNeighborEntries(node);
    }
};
exports.getNeighborsForNode = getNeighborsForNode;
