# Graphology Traversal Iterator
Refactored BFS and DFS traversal implementations of [`Graphology`](https://graphology.github.io) to support the JS Iterator protocol instead of callbacks


## Installation

```
npm install graphology-traversal
```

## Usage

- [bfs](#bfs)
- [bfsFromNode](#bfsfromnode)
- [dfs](#dfs)
- [dfsFromNode](#bfsfromnode)

### bfs

Perform a BFS (Breadth-First Search) over the given graph using a callback.

```js
import { bfs, bfsFromNode } from './index';

for(const [node, attr, depth] of bfs(graph)){
  console.log(node, attr, depth);
}

// Stopping at depth 3
for(const [node, attr, depth] of bfs(graph)){
  if(depth >= 3){
    break;
  }
}
```

_Arguments_

- **graph** _Graph_: a graphology instance.
- **options** _?object_: traversal options:
  - **mode** _?string_ [`outbound`]: type of neighbors to traverse.

### bfsFromNode

Perform a BFS (Breadth-First Search) over the given graph, starting from the given node, using a callback.

```js
import { bfs, bfsFromNode } from './index';

for(const [node, attr, depth] of bfsFromNode(graph, 'node1')){
  console.log(node, attr, depth);
}

// Stopping at depth 3
for(const [node, attr, depth] of bfsFromNode(graph, 'node1')){
  if(depth >= 3){
    break;
  }
}
```

_Arguments_

- **graph** _Graph_: a graphology instance.
- **node** _string\|number_: starting node.
- **options** _?object_: traversal options:
  - **mode** _?string_ [`outbound`]: type of neighbors to traverse.

### dfs

Perform a DFS (Depth-First Search) over the given graph using a callback.

```js
import {dfs, dfsFromNode} from './index';

for(const [node, attr, depth] of dfs(graph)){
  console.log(node, attr, depth);
}

// Stopping at depth 3
for(const [node, attr, depth] of dfs(graph)){
  if(depth >= 3){
    break;
  }
}
```

_Arguments_

- **graph** _Graph_: a graphology instance.
- **options** _?object_: traversal options:
  - **mode** _?string_ [`outbound`]: type of neighbors to traverse.

### dfsFromNode

Perform a DFS (Depth-First Search) over the given graph, starting from the given node, using a callback.

```js
import { dfs, dfsFromNode } from './index';

for(const [node, attr, depth] of dfsFromNode(graph, 'node1')){
  console.log(node, attr, depth);
}

// Stopping at depth 3
for(const [node, attr, depth] of dfsFromNode(graph, 'node1')){
  if(depth >= 3){
    break;
  }
}
```

_Arguments_

- **graph** _Graph_: a graphology instance.
- **node** _string\|number_: starting node.
- **options** _?object_: traversal options:
  - **mode** _?string_ [`outbound`]: type of neighbors to traverse.
