//print all non-child node for a given tree and node
var treeChildMapping = {
	root: "A",
	"A": ["B", "C", "D"],
	"B": ["E"],
	"C": ["F", "G", "H"],
	"D": ["I"],
	"E": [],
	"F": [],
	"G": [],
	"H": [],
	"I": []
}

function printNonChildNodes(tree, node){
	var rootNode = tree.root;

	var output = [];
	var printNode = function(n){
		console.log(n);
		if(n !== node){
			output.push(n);
			console.log("push " + n);
			var childs = tree[n];

			if(childs.length == 0)
				return;
			for(var i = 0; i < childs.length; i++)
				printNode(childs[i]);
		}
	}

	printNode(rootNode);

	return output.join();
}
console.log(printNonChildNodes(treeChildMapping, "D"));
