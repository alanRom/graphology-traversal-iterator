/**
 * Graphology Traversal BFS
 * =========================
 *
 * Breadth-First Search traversal function.
 */
import isGraph from 'graphology-utils/is-graph';
import BFSQueue from 'graphology-indices/bfs-queue';
import { AbstractGraph, Attributes, NodeEntry } from 'graphology-types';
import { TraversalRecord, TraversalModes, getNeighborsForNode, getTraversalModeFromString } from './utils';
import { TraversalMode } from './types';

/**
 * BFS traversal in the given graph using a callback function
 *
 * @param {Graph}    graph        - Target graph.
 * @param {string}   startingNode - Optional Starting node.
 * @param {function} callback     - Iteration callback.
 * @param {object}   options      - Options:
 * @param {string}     mode         - Traversal mode.
 */
function *abstractBfs(graph: AbstractGraph, startingNode: string | null, options?: { mode?: TraversalModes | TraversalMode }): Generator<[string, Attributes, number], void, unknown> {
    options = options || {};
    
    const traversalMode = options.mode ? (typeof options.mode == 'string' ? getTraversalModeFromString(options.mode) : options.mode) : TraversalModes.Outbound;

    if (!isGraph(graph))
        throw new Error(
            'graphology-traversal/bfs: expecting a graphology instance.'
        );


    // Early termination
    if (graph.order === 0) return;

    const queue = new BFSQueue<TraversalRecord>(graph);
    const nodesYetUnseen = new Set(graph.nodes());
    const startingNodeToUse = startingNode == null ? graph.nodes()[0] : startingNode.toString();

    let record: TraversalRecord | undefined;
    queue.pushWith(startingNodeToUse, new TraversalRecord( startingNodeToUse, graph.getNodeAttributes(startingNodeToUse), 0));


        while (queue.size !== 0 || nodesYetUnseen.size > 0) {
            record = queue.shift();
            if(record === undefined ){
                if(nodesYetUnseen.size > 0 && startingNode === null){
                    const nextUnseen: string = nodesYetUnseen.values().next().value as string;
                    record = new TraversalRecord(nextUnseen, graph.getNodeAttributes(nextUnseen), 0);
                } else {
                    break;
                } 
            }

            if(!nodesYetUnseen.has(record.node)){
                continue
            }
    
            nodesYetUnseen.delete(record.node);

            yield [record.node, record.attributes, record.depth];

            for(const neighbor of getNeighborsForNode(graph, record.node, traversalMode)){
                queue.pushWith(
                    neighbor.neighbor,
                    new TraversalRecord(neighbor.neighbor, neighbor.attributes, record.depth + 1)
                );
            }
        }
}

export const bfs = function (graph: AbstractGraph, options?: { mode?: TraversalModes | TraversalMode }) {
    return abstractBfs(graph, null, options);
};

export const bfsFromNode = abstractBfs;
