/**
 * Graphology Utils Unit Tests
 * ============================
 */
import assert from 'assert';
import Graph, {DirectedGraph} from 'graphology';
import mergeCycle from 'graphology-utils/merge-cycle';
import mergeStar from 'graphology-utils/merge-star';
import erdosRenyi from 'graphology-generators/random/erdos-renyi';
import pathGraph from 'graphology-generators/classic/path';

import {bfs, bfsFromNode, dfs, dfsFromNode} from './index';


describe('graphology-traversal', function () {
  describe('dfs', function () {
    it('should throw if given invalid arguments.', function () {
      assert.throws(function () {
        //@ts-expect-error Testing null graph
        dfs(null).next();
      }, /graph/);

    
    });

    it('should traverse the graph correctly.', function () {
      const graph = new Graph();

      graph.mergeEdge(1, 2);
      graph.mergeEdge(1, 3);
      graph.mergeEdge(2, 4);
      graph.mergeEdge(4, 3);

      graph.addNode(5, {hello: 'world'});
      graph.mergeEdge(6, 7);
      graph.mergeEdge(7, 8);
      graph.mergeEdge(8, 6);

      const path: string[] = [];

      for(const [node, attr] of dfs(graph)) {
        if (node === '5') assert.deepStrictEqual(attr, {hello: 'world'});
        else assert.deepStrictEqual(attr, {});

        path.push(node);
      }
      assert.deepStrictEqual(path, ['1', '3', '2', '4', '5', '6', '7', '8']);
    });

    it('should work with cycles.', function () {
      const graph = new Graph();
      mergeCycle(graph, [1, 2, 3, 4, 5]);

      const path: string[] = [];

      for(const [node] of dfs(graph)){
        path.push(node);
      }

      assert.deepStrictEqual(path, ['1', '2', '3', '4', '5']);
    });

    it('should iterate on every node.', function () {
      const graph = erdosRenyi.sparse(DirectedGraph, {
        order: 100,
        probability: 0.1
      });

      const path: string[] = [];

      for(const [node] of dfs(graph)){
        path.push(node);
      }

      assert.deepStrictEqual(new Set(graph.nodes()), new Set(path));
    });

    it('should produce the expected results with trees.', function () {
      const graph = new Graph();

      graph.mergeEdge(1, 2);
      graph.mergeEdge(1, 3);
      graph.mergeEdge(2, 4);
      graph.mergeEdge(2, 5);
      graph.mergeEdge(3, 6);
      graph.mergeEdge(3, 7);

      const path: string[] = [];

      for(const [node] of dfs(graph)){
        path.push(node);
      }

      assert.deepStrictEqual(path, ['1', '3', '7', '6', '2', '5', '4']);
    });

    it('should expose traversal depth.', function () {
      const graph = new Graph();
      mergeCycle(graph, [1, 2, 3, 4]);

      const path: [string, number][] = [];

      for(const [node, attr, depth] of dfs(graph)){
        path.push([node, depth]);
      }

      assert.deepStrictEqual(path, [
        ['1', 0],
        ['2', 1],
        ['3', 2],
        ['4', 3]
      ]);
    });

    it('should be possible to start from a given node.', function () {
      const graph = new Graph();
      mergeCycle(graph, [1, 2, 3, 4]);
      graph.addNode(5);

      const path: [string, number][] = [];

      for(const [node, attr, depth] of dfsFromNode(graph, '3')){
        path.push([node, depth]);
      }

      assert.deepStrictEqual(path, [
        ['3', 0],
        ['4', 1],
        ['1', 2],
        ['2', 3]
      ]);
    });

    it('should work when the graph has no edge.', function () {
      const graph = new Graph();

      graph.addNode('0');
      graph.addNode('1');

      let path = new Set<string>();

      for(const [node] of dfs(graph)){
        path.add(node);
      }

      assert.deepStrictEqual(path, new Set(['0', '1']));

      path = new Set();

      for(const [node] of dfsFromNode(graph, '0')){
        path.add(node);
      }

      assert.deepStrictEqual(path, new Set(['0']));
    });

    it('should be possible to stop.', function () {
      const graph = pathGraph(Graph, 10);

      const path: string[] = [];
      for(const [node, attr, depth] of dfsFromNode(graph, '0')){
        path.push(node);
        if(depth >= 3){
          break
        }
      }

      assert.deepStrictEqual(path, ['0', '1', '2', '3']);
    });

    it('should be possible to change the traversal mode.', function () {
      const graph = pathGraph(DirectedGraph, 5);

      const path: string[] = [];

      for(const [node] of dfsFromNode(graph, '2', {mode: 'inbound'})){
        path.push(node);
      }

      assert.deepStrictEqual(path, ['2', '1', '0']);
    });

    it.skip('should have a valid depth wrt DFS constraints (issue #481).', function () {
      const graph = new DirectedGraph();
      graph.addNode('1');
      graph.addNode('2');
      graph.addNode('3');
      graph.addDirectedEdge('1', '3');
      graph.addDirectedEdge('3', '2');
      graph.addDirectedEdge('1', '2');

      const traversal: [string, number][] = [];

      for(const [node, attr, depth] of dfsFromNode(graph, '1')){
        traversal.push([node, depth]);
      }
      console.log(traversal);

      assert.deepStrictEqual(traversal, [
        ['1', 0],
        ['2', 1],
        ['3', 2]
      ]);
    });
  });

  describe('bfs', function () {
    it('should throw if given invalid arguments.', function () {
      assert.throws(function () {
        //@ts-expect-error Testing null graph
        bfs(null).next();
      }, /graph/);
    });

    it('should traverse the graph correctly.', function () {
      const graph = new Graph();
      mergeStar(graph, [1, 2, 3, 4]);
      mergeStar(graph, [2, 5, 6]);
      mergeStar(graph, [3, 7, 8]);
      graph.mergeEdge(4, 8);

      graph.addNode(9, {hello: 'world'});

      const path: string[] = [];

      for(const [node, attr] of bfs(graph)){
        if (node === '9') assert.deepStrictEqual(attr, {hello: 'world'});
        else assert.deepStrictEqual(attr, {});

        path.push(node);
      }

      assert.deepStrictEqual(path, [
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

      const dfsPath: string[] = [];

      for(const [node, attr] of dfs(graph)){
        dfsPath.push(node);
      }

      assert.notDeepStrictEqual(path, dfsPath);
    });

    it('should iterate on every node.', function () {
      const graph = erdosRenyi.sparse(DirectedGraph, {
        order: 100,
        probability: 0.1
      });

      const path: string[] = [];

      for(const [node] of bfs(graph)){
        path.push(node);
      }

      assert.deepStrictEqual(new Set(graph.nodes()), new Set(path));
    });

    it('should produce the expected results with trees.', function () {
      const graph = new Graph();

      graph.mergeEdge(1, 2);
      graph.mergeEdge(1, 3);
      graph.mergeEdge(2, 4);
      graph.mergeEdge(2, 5);
      graph.mergeEdge(3, 6);
      graph.mergeEdge(3, 7);

      const path: string[] = [];

      for(const [node] of bfs(graph)){
        path.push(node);
      }

      assert.deepStrictEqual(path, ['1', '2', '3', '4', '5', '6', '7']);
    });

    it('should expose traversal depth.', function () {
      const graph = new Graph();
      mergeCycle(graph, [1, 2, 3, 4]);

      const path: [string, number][] = [];

      for(const [node, attr, depth] of bfs(graph)){
        path.push([node, depth]);
      }

      assert.deepStrictEqual(path, [
        ['1', 0],
        ['2', 1],
        ['3', 2],
        ['4', 3]
      ]);
    });

    it('should be possible to start from a given node.', function () {
      const graph = new Graph();
      mergeCycle(graph, [1, 2, 3, 4]);
      graph.addNode(5);

      const path: [string, number][] = [];

      for(const [node, attr, depth] of bfsFromNode(graph, '4')){
        path.push([node, depth]);
      }

      assert.deepStrictEqual(path, [
        ['4', 0],
        ['1', 1],
        ['2', 2],
        ['3', 3]
      ]);
    });

    it('should work when the graph has no edge.', function () {
      const graph = new Graph();

      graph.addNode('0');
      graph.addNode('1');

      let path = new Set<string>();

      for(const [node] of bfs(graph)){
        path.add(node);
      }

      assert.deepStrictEqual(path, new Set(['0', '1']));

      path = new Set<string>();

      for(const [node] of bfsFromNode(graph, '0')){
        path.add(node);
      }

      assert.deepStrictEqual(path, new Set(['0']));
    });

    it('should be possible to stop.', function () {
      const graph = new Graph();

      graph.mergeEdge(0, 1);
      graph.mergeEdge(1, 2);
      graph.mergeEdge(0, 2);
      graph.mergeEdge(2, 3);
      graph.mergeEdge(3, 4);
      graph.mergeEdge(3, 5);
      graph.mergeEdge(4, 6);

      const path = new Set<string>();

      for(const [node, attr, depth] of bfsFromNode(graph, '0')){
        path.add(node);
        if(depth > 1){
          break
        }
      }

      assert.deepStrictEqual(path, new Set(['0', '1', '2', '3']));
    });

    it('should be possible to change the traversal mode.', function () {
      const graph = pathGraph(DirectedGraph, 5);

      const path: string[] = [];

      for(const [node, attr, depth] of bfsFromNode(graph, '2', {mode: 'inbound'})){
        path.push(node);
      }

      assert.deepStrictEqual(path, ['2', '1', '0']);
    });
  });
});
