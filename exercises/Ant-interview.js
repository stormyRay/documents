// No.1 用 ES5（基于 prototype）实现经典继承
function Master(prop) {
  this.prop = prop;
}
Master.prototype.getProp = function() {
  return this.prop;
};

function Sub(subProp) {
  Master.call(this);
  this.subProp = subProp;
}

Sub.prototype = new Master();

// No.2 create tree from flat data 将输入的数组组装成一颗树状的数据结构，时间复杂度越小越好。要求程序具有侦测错误输入的能力。
const flatData = [
  { id: 2, name: "i2", parentId: 9 },
  { id: 8, name: "i8", parentId: 2 },
  { id: 3, name: "i3", parentId: 2 },
  { id: 9, name: "i9" },
  { id: 4, name: "i4", parentId: 3 }
];

function Node(data) {
  this.data = data;
  this.children = [];
  this.appendChild = function(node) {
    this.children.push(node);
  }.bind(this);
}

function Tree(root) {
  this.root = root;
}

function createTreeFromList(array) {
  //Mapping for the nodes, in type: {[id: any]: Node}
  let nodeDict = {};
  //Mapping for the id-children, in type: {[id: any]: Array<[childId: any]>}
  let childrenDict = {};
  // Store the parent Id which is not created
  let uncreatedNodeIds = [];
  let isInputIncorect = false;
  let rootId = null;

  let len = array.length;
  for (let i = 0; i < len; i++) {
    let data = array[i];
    if (data.id === undefined || data.name === undefined) {
      //Detect whether the data is lack of necessary fields
      //Other format criteria can be applied here if needed, such as "id type must be number"
      isInputIncorect = true;
      handleCreateTreeError("Input has data in incorrect format!");
      break;
    }

    if (!nodeDict[data.id]) {
      nodeDict[data.id] = new Node(data);
      if (uncreatedNodeIds.indexOf(data.id) > -1) {
        uncreatedNodeIds.splice(uncreatedNodeIds.indexOf(data.id), 1);
      }
      if (childrenDict[data.id]) {
        //Find out whether we have already store its children
        childrenDict[data.id].map(nodeId => {
          nodeDict[data.id].appendChild(nodeDict[nodeId]);
        });
      }

      //Update parent id, if we have already build the parent, we directly append it into parent node
      // Otherwise we push it into the children mapping
      if (nodeDict[data.parentId]) {
        nodeDict[data.parentId].appendChild(nodeDict[data.id]);
      } else {
        if (data.parentId) {
          uncreatedNodeIds.push(data.parentId);
        }
        if (childrenDict[data.parentId]) {
          childrenDict[data.parentId].push(data.id);
        } else {
          childrenDict[data.parentId] = [data.id];
        }
      }
    } else {
      let nodeData = nodeDict[data.id].data;
      if (nodeData.name !== data.name || nodeData.parentId !== data.parentId) {
        //In this case we allow duplicated data,
        // but if we found two data with same id and different parent or name,
        // we regard it as error
        isInputIncorect = true;
        handleCreateTreeError("Input has paradoxial data!");
        break;
      }
    }
    if (!data.parentId) {
      if (rootId || rootId === 0) {
        isInputIncorect = true;
        handleCreateTreeError("Input has multiple root nodes!");
        break;
      } else {
        rootId = data.id;
      }
    }
  }

  if (uncreatedNodeIds.length > 0) {
    isInputIncorect = true;
    handleCreateTreeError("Input has node with undefined parent node!");
  }

  if (!isInputIncorect && rootId) {
    return new Tree(nodeDict[rootId]);
  } else {
    return null;
  }
}

function handleCreateTreeError(err) {
  //handle error
  console.log(err);
}

console.log(createTreeFromList(flatData));

// No.3 根据输入的数组中每项的 before/after/first/last 规则，输出一个新排好序的数组或者链表。要求，多解的情况可以只求一解，如果无解要求程序能检测出来。
const arr = [
  { id: 8 },
  { id: 1 },
  { id: 2, before: 1 },
  { id: 3, after: 1 },
  { id: 5, first: true },
  { id: 6, last: true },
  { id: 7, after: 8 },
  { id: 9 }
];

function buildList(array) {
  let len = array.length;
  if (len <= 0) {
    return null;
  }

  // Store the sub list which is not connected to others
  let subArrays = [];
  //Store the node is in which sub list, type of {[id: any]: number}
  let inWhichSubDict = {};

  let hasResult = true;
  let first = null;
  let last = null;

  //Initialize the sub lists
  for (let i = 0; i < len; i++) {
    let data = array[i];
    subArrays.push([data]);
    inWhichSubDict[data.id] = i;
  }

  //Sorting
  for (let i = 0; i < len; i++) {
    let data = array[i];
    if (data.first) {
      if (first) {
        hasResult = false;
        handleBuildListError("No results due to multiple first node");
        break;
      }
      let subList = subArrays[inWhichSubDict[data.id]];
      if (subList[0].id !== data.id) {
        hasResult = false;
        handleBuildListError("No results due to paradoxial definition");
        break;
      }
      subArrays[0] = subList.concat(subArrays[0]);
      subArrays[inWhichSubDict[data.id]] = [];
      inWhichSubDict[data.id] = 0;
    } else if (data.last) {
      if (last) {
        hasResult = false;
        handleBuildListError("No results due to multiple last node");
        break;
      }
      let subList = subArrays[inWhichSubDict[data.id]];
      if (subList[subList.length - 1].id !== data.id) {
        hasResult = false;
        handleBuildListError("No results due to paradoxial definition");
        break;
      }
      subArrays[len - 1] = subArrays[len - 1].concat(subList);
      subArrays[inWhichSubDict[data.id]] = [];
      inWhichSubDict[data.id] = len - 1;
    } else if (data.after) {
      let newTargetIndex = inWhichSubDict[data.after];
      if (!newTargetIndex && newTargetIndex !== 0) {
        hasResult = false;
        handleBuildListError("No results due to incorrect definition");
        break;
      }
      let targetIndex = inWhichSubDict[data.id];
      if (
        targetIndex === newTargetIndex ||
        newTargetIndex === inWhichSubDict[last]
      ) {
        hasResult = false;
        handleBuildListError("No results due to paradoxial definition");
        break;
      }

      let targetList = subArrays[targetIndex];
      let newTargetList = subArrays[newTargetIndex];
      targetList.map(data => {
        inWhichSubDict[data.id] = newTargetIndex;
      });
      subArrays[newTargetIndex] = newTargetList.concat(targetList);
      subArrays[targetIndex] = [];
    } else if (data.before) {
      let newTargetIndex = inWhichSubDict[data.before];
      if (!newTargetIndex && newTargetIndex !== 0) {
        hasResult = false;
        handleBuildListError("No results due to incorrect definition");
        break;
      }
      let targetIndex = inWhichSubDict[data.id];
      let newTargetList = subArrays[newTargetIndex];
      if (
        targetIndex === newTargetIndex ||
        newTargetIndex === inWhichSubDict[first]
      ) {
        hasResult = false;
        handleBuildListError("No results due to paradoxial definition");
        break;
      }

      let targetList = subArrays[targetIndex];
      targetList.map(data => {
        inWhichSubDict[data.id] = newTargetIndex;
      });
      subArrays[newTargetIndex] = targetList.concat(newTargetList);
      subArrays[targetIndex] = [];
    }
  }

  if (!hasResult) {
    return null;
  } else {
    let res = [];
    for (let i = 0; i < subArrays.length; i++) {
      res = res.concat(subArrays[i]);
    }
    return res;
  }
}

function handleBuildListError(err) {
  console.log(err);
}

console.log(buildList(arr));

// No.4 Make a chain of dominoes.
/*
Compute a way to order a given set of dominoes in such a way that they form a correct domino chain 
(the dots on one half of a stone match the dots on the neighbouring half of an adjacent stone) and that dots on the 
halfs of the stones which don't have a neighbour (the first and last stone) match each other.
For example given the stones 21, 23 and 13 you should compute something like 12 23 31 or 32 21 13 or 13 32 21 etc, 
where the first and last numbers are the same.
For stones 12, 41 and 23 the resulting chain is not valid: 41 12 23's first and last numbers are not the same. 4 != 3
Some test cases may use duplicate stones in a chain solution, assume that multiple Domino sets are being used.
Input example: (1, 2), (5, 3), (3, 1), (1, 2), (2, 4), (1, 6), (2, 3), (3, 4), (5, 6)
*/
