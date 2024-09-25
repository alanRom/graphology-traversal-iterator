"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bfsFromNode = exports.bfs = void 0;
/**
 * Graphology Traversal BFS
 * =========================
 *
 * Breadth-First Search traversal function.
 */
const is_graph_1 = __importDefault(require("graphology-utils/is-graph"));
const bfs_queue_1 = __importDefault(require("graphology-indices/bfs-queue"));
const utils_1 = require("./utils");
/**
 * BFS traversal in the given graph using a callback function
 *
 * @param {Graph}    graph        - Target graph.
 * @param {string}   startingNode - Optional Starting node.
 * @param {function} callback     - Iteration callback.
 * @param {object}   options      - Options:
 * @param {string}     mode         - Traversal mode.
 */
function* abstractBfs(graph, startingNode, options) {
    options = options || {};
    const traversalMode = options.mode ? (typeof options.mode == 'string' ? (0, utils_1.getTraversalModeFromString)(options.mode) : options.mode) : utils_1.TraversalModes.Outbound;
    if (!(0, is_graph_1.default)(graph))
        throw new Error('graphology-traversal/bfs: expecting a graphology instance.');
    // Early termination
    if (graph.order === 0)
        return;
    const queue = new bfs_queue_1.default(graph);
    const nodesYetUnseen = new Set(graph.nodes());
    const startingNodeToUse = startingNode == null ? graph.nodes()[0] : startingNode.toString();
    let record;
    queue.pushWith(startingNodeToUse, new utils_1.TraversalRecord(startingNodeToUse, graph.getNodeAttributes(startingNodeToUse), 0));
    while (queue.size !== 0 || nodesYetUnseen.size > 0) {
        record = queue.shift();
        if (record === undefined) {
            if (nodesYetUnseen.size > 0 && startingNode === null) {
                const nextUnseen = nodesYetUnseen.values().next().value;
                record = new utils_1.TraversalRecord(nextUnseen, graph.getNodeAttributes(nextUnseen), 0);
            }
            else {
                break;
            }
        }
        if (!nodesYetUnseen.has(record.node)) {
            continue;
        }
        nodesYetUnseen.delete(record.node);
        yield [record.node, record.attributes, record.depth];
        for (const neighbor of (0, utils_1.getNeighborsForNode)(graph, record.node, traversalMode)) {
            queue.pushWith(neighbor.neighbor, new utils_1.TraversalRecord(neighbor.neighbor, neighbor.attributes, record.depth + 1));
        }
    }
}
const bfs = function (graph, options) {
    return abstractBfs(graph, null, options);
};
exports.bfs = bfs;
exports.bfsFromNode = abstractBfs;
