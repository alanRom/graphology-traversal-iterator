"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Graphology Utils Unit Tests
 * ============================
 */
const assert_1 = __importDefault(require("assert"));
const graphology_1 = __importStar(require("graphology"));
const merge_cycle_1 = __importDefault(require("graphology-utils/merge-cycle"));
const merge_star_1 = __importDefault(require("graphology-utils/merge-star"));
const erdos_renyi_1 = __importDefault(require("graphology-generators/random/erdos-renyi"));
const path_1 = __importDefault(require("graphology-generators/classic/path"));
const index_1 = require("./index");
describe('graphology-traversal', function () {
    describe('dfs', function () {
        it('should throw if given invalid arguments.', function () {
            assert_1.default.throws(function () {
                //@ts-expect-error Testing null graph
                (0, index_1.dfs)(null).next();
            }, /graph/);
        });
        it('should traverse the graph correctly.', function () {
            const graph = new graphology_1.default();
            graph.mergeEdge(1, 2);
            graph.mergeEdge(1, 3);
            graph.mergeEdge(2, 4);
            graph.mergeEdge(4, 3);
            graph.addNode(5, { hello: 'world' });
            graph.mergeEdge(6, 7);
            graph.mergeEdge(7, 8);
            graph.mergeEdge(8, 6);
            const path = [];
            for (const [node, attr] of (0, index_1.dfs)(graph)) {
                if (node === '5')
                    assert_1.default.deepStrictEqual(attr, { hello: 'world' });
                else
                    assert_1.default.deepStrictEqual(attr, {});
                path.push(node);
            }
            assert_1.default.deepStrictEqual(path, ['1', '3', '2', '4', '5', '6', '7', '8']);
        });
        it('should work with cycles.', function () {
            const graph = new graphology_1.default();
            (0, merge_cycle_1.default)(graph, [1, 2, 3, 4, 5]);
            const path = [];
            for (const [node] of (0, index_1.dfs)(graph)) {
                path.push(node);
            }
            assert_1.default.deepStrictEqual(path, ['1', '2', '3', '4', '5']);
        });
        it('should iterate on every node.', function () {
            const graph = erdos_renyi_1.default.sparse(graphology_1.DirectedGraph, {
                order: 100,
                probability: 0.1
            });
            const path = [];
            for (const [node] of (0, index_1.dfs)(graph)) {
                path.push(node);
            }
            assert_1.default.deepStrictEqual(new Set(graph.nodes()), new Set(path));
        });
        it('should produce the expected results with trees.', function () {
            const graph = new graphology_1.default();
            graph.mergeEdge(1, 2);
            graph.mergeEdge(1, 3);
            graph.mergeEdge(2, 4);
            graph.mergeEdge(2, 5);
            graph.mergeEdge(3, 6);
            graph.mergeEdge(3, 7);
            const path = [];
            for (const [node] of (0, index_1.dfs)(graph)) {
                path.push(node);
            }
            assert_1.default.deepStrictEqual(path, ['1', '3', '7', '6', '2', '5', '4']);
        });
        it('should expose traversal depth.', function () {
            const graph = new graphology_1.default();
            (0, merge_cycle_1.default)(graph, [1, 2, 3, 4]);
            const path = [];
            for (const [node, attr, depth] of (0, index_1.dfs)(graph)) {
                path.push([node, depth]);
            }
            assert_1.default.deepStrictEqual(path, [
                ['1', 0],
                ['2', 1],
                ['3', 2],
                ['4', 3]
            ]);
        });
        it('should be possible to start from a given node.', function () {
            const graph = new graphology_1.default();
            (0, merge_cycle_1.default)(graph, [1, 2, 3, 4]);
            graph.addNode(5);
            const path = [];
            for (const [node, attr, depth] of (0, index_1.dfsFromNode)(graph, '3')) {
                path.push([node, depth]);
            }
            assert_1.default.deepStrictEqual(path, [
                ['3', 0],
                ['4', 1],
                ['1', 2],
                ['2', 3]
            ]);
        });
        it('should work when the graph has no edge.', function () {
            const graph = new graphology_1.default();
            graph.addNode('0');
            graph.addNode('1');
            let path = new Set();
            for (const [node] of (0, index_1.dfs)(graph)) {
                path.add(node);
            }
            assert_1.default.deepStrictEqual(path, new Set(['0', '1']));
            path = new Set();
            for (const [node] of (0, index_1.dfsFromNode)(graph, '0')) {
                path.add(node);
            }
            assert_1.default.deepStrictEqual(path, new Set(['0']));
        });
        it('should be possible to stop.', function () {
            const graph = (0, path_1.default)(graphology_1.default, 10);
            const path = [];
            for (const [node, attr, depth] of (0, index_1.dfsFromNode)(graph, '0')) {
                path.push(node);
                if (depth >= 3) {
                    break;
                }
            }
            assert_1.default.deepStrictEqual(path, ['0', '1', '2', '3']);
        });
        it('should be possible to change the traversal mode.', function () {
            const graph = (0, path_1.default)(graphology_1.DirectedGraph, 5);
            const path = [];
            for (const [node] of (0, index_1.dfsFromNode)(graph, '2', { mode: 'inbound' })) {
                path.push(node);
            }
            assert_1.default.deepStrictEqual(path, ['2', '1', '0']);
        });
        it.skip('should have a valid depth wrt DFS constraints (issue #481).', function () {
            const graph = new graphology_1.DirectedGraph();
            graph.addNode('1');
            graph.addNode('2');
            graph.addNode('3');
            graph.addDirectedEdge('1', '3');
            graph.addDirectedEdge('3', '2');
            graph.addDirectedEdge('1', '2');
            const traversal = [];
            for (const [node, attr, depth] of (0, index_1.dfsFromNode)(graph, '1')) {
                traversal.push([node, depth]);
            }
            console.log(traversal);
            assert_1.default.deepStrictEqual(traversal, [
                ['1', 0],
                ['2', 1],
                ['3', 2]
            ]);
        });
    });
    describe('bfs', function () {
        it('should throw if given invalid arguments.', function () {
            assert_1.default.throws(function () {
                //@ts-expect-error Testing null graph
                (0, index_1.bfs)(null).next();
            }, /graph/);
        });
        it('should traverse the graph correctly.', function () {
            const graph = new graphology_1.default();
            (0, merge_star_1.default)(graph, [1, 2, 3, 4]);
            (0, merge_star_1.default)(graph, [2, 5, 6]);
            (0, merge_star_1.default)(graph, [3, 7, 8]);
            graph.mergeEdge(4, 8);
            graph.addNode(9, { hello: 'world' });
            const path = [];
            for (const [node, attr] of (0, index_1.bfs)(graph)) {
                if (node === '9')
                    assert_1.default.deepStrictEqual(attr, { hello: 'world' });
                else
                    assert_1.default.deepStrictEqual(attr, {});
                path.push(node);
            }
            assert_1.default.deepStrictEqual(path, [
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9'
            ]);
            const dfsPath = [];
            for (const [node, attr] of (0, index_1.dfs)(graph)) {
                dfsPath.push(node);
            }
            assert_1.default.notDeepStrictEqual(path, dfsPath);
        });
        it('should iterate on every node.', function () {
            const graph = erdos_renyi_1.default.sparse(graphology_1.DirectedGraph, {
                order: 100,
                probability: 0.1
            });
            const path = [];
            for (const [node] of (0, index_1.bfs)(graph)) {
                path.push(node);
            }
            assert_1.default.deepStrictEqual(new Set(graph.nodes()), new Set(path));
        });
        it('should produce the expected results with trees.', function () {
            const graph = new graphology_1.default();
            graph.mergeEdge(1, 2);
            graph.mergeEdge(1, 3);
            graph.mergeEdge(2, 4);
            graph.mergeEdge(2, 5);
            graph.mergeEdge(3, 6);
            graph.mergeEdge(3, 7);
            const path = [];
            for (const [node] of (0, index_1.bfs)(graph)) {
                path.push(node);
            }
            assert_1.default.deepStrictEqual(path, ['1', '2', '3', '4', '5', '6', '7']);
        });
        it('should expose traversal depth.', function () {
            const graph = new graphology_1.default();
            (0, merge_cycle_1.default)(graph, [1, 2, 3, 4]);
            const path = [];
            for (const [node, attr, depth] of (0, index_1.bfs)(graph)) {
                path.push([node, depth]);
            }
            assert_1.default.deepStrictEqual(path, [
                ['1', 0],
                ['2', 1],
                ['3', 2],
                ['4', 3]
            ]);
        });
        it('should be possible to start from a given node.', function () {
            const graph = new graphology_1.default();
            (0, merge_cycle_1.default)(graph, [1, 2, 3, 4]);
            graph.addNode(5);
            const path = [];
            for (const [node, attr, depth] of (0, index_1.bfsFromNode)(graph, '4')) {
                path.push([node, depth]);
            }
            assert_1.default.deepStrictEqual(path, [
                ['4', 0],
                ['1', 1],
                ['2', 2],
                ['3', 3]
            ]);
        });
        it('should work when the graph has no edge.', function () {
            const graph = new graphology_1.default();
            graph.addNode('0');
            graph.addNode('1');
            let path = new Set();
            for (const [node] of (0, index_1.bfs)(graph)) {
                path.add(node);
            }
            assert_1.default.deepStrictEqual(path, new Set(['0', '1']));
            path = new Set();
            for (const [node] of (0, index_1.bfsFromNode)(graph, '0')) {
                path.add(node);
            }
            assert_1.default.deepStrictEqual(path, new Set(['0']));
        });
        it('should be possible to stop.', function () {
            const graph = new graphology_1.default();
            graph.mergeEdge(0, 1);
            graph.mergeEdge(1, 2);
            graph.mergeEdge(0, 2);
            graph.mergeEdge(2, 3);
            graph.mergeEdge(3, 4);
            graph.mergeEdge(3, 5);
            graph.mergeEdge(4, 6);
            const path = new Set();
            for (const [node, attr, depth] of (0, index_1.bfsFromNode)(graph, '0')) {
                path.add(node);
                if (depth > 1) {
                    break;
                }
            }
            assert_1.default.deepStrictEqual(path, new Set(['0', '1', '2', '3']));
        });
        it('should be possible to change the traversal mode.', function () {
            const graph = (0, path_1.default)(graphology_1.DirectedGraph, 5);
            const path = [];
            for (const [node, attr, depth] of (0, index_1.bfsFromNode)(graph, '2', { mode: 'inbound' })) {
                path.push(node);
            }
            assert_1.default.deepStrictEqual(path, ['2', '1', '0']);
        });
    });
});
