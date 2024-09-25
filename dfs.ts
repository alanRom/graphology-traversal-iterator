/**
 * Graphology Traversal DFS
 * =========================
 *
 * Depth-First Search traversal function.
 */
import isGraph from 'graphology-utils/is-graph';
import DFSStack from 'graphology-indices/dfs-stack';
import { AbstractGraph, Attributes } from 'graphology-types';
import { TraversalModes, TraversalRecord, getNeighborsForNode, getTraversalModeFromString } from './utils';
import { TraversalMode } from './types';

/**
 * DFS traversal in the given graph using a callback function
 *
 * @param {Graph}    graph        - Target graph.
 * @param {string}   startingNode - Optional Starting node.
 * @param {object}   options      - Options:
 * @param {string}     mode         - Traversal mode.
 */

function *abstractDfs(graph: AbstractGraph, startingNode: string | null = null, options?: { mode?: TraversalModes | TraversalMode }): Generator<[string, Attributes, number], void, unknown> {
    options = options || {};
    
    const traversalMode = options.mode ? (typeof options.mode === 'string' ? getTraversalModeFromString(options.mode) : options.mode) : TraversalModes.Outbound;

    if (!isGraph(graph))
        throw new Error(
            'graphology-traversal/dfs: expecting a graphology instance.'
        );

    // Early termination
    if (graph.order === 0) return;

    const stack = new DFSStack<TraversalRecord>(graph);
    const nodesYetUnseen = new Set(graph.nodes());

    const startingNodeToUse = startingNode == null ? graph.nodes()[0] : startingNode.toString();

    let record: TraversalRecord | undefined;
    stack.pushWith(startingNodeToUse, new TraversalRecord( startingNodeToUse, graph.getNodeAttributes(startingNodeToUse), 0));

    while (stack.size !== 0 || nodesYetUnseen.size > 0) {
        record = stack.pop();
        
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

        const neighbors = getNeighborsForNode(graph, record.node, traversalMode);
        for(const neighbor of neighbors){
            stack.pushWith(
                neighbor.neighbor,
                new TraversalRecord(neighbor.neighbor, neighbor.attributes, record.depth + 1)
            );
        }
    }
}

export const dfs = function (graph: AbstractGraph, options?: { mode?: TraversalModes | TraversalMode }) {
    return abstractDfs(graph, null, options);
};

export const dfsFromNode = abstractDfs;
