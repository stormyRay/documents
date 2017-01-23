//print all the permutation(ABDC, ADBC...) of letters(A, B, C, D....) with given rules (A->C, B->C...)
//Not complete this one!!!
var letterArray = ["A", "B", "C", "D"];
var cannotPlaceBefore = {
	"A": ["C"],
	"B": ["C"],
	"D": ["C"]
}

var results=[]


function permutation(letters, rules){
	var strings = [];
	putLetterAfterString(letters, rules, "", strings);
	return strings.join();
}

function pickLetterToString(letters, index, string, rules){
	if(letters.length <= 0)
		return;
	for(var i = 0; i < letters.length; i++){
		var letter = letters[index];
		var remainingLetters = letters.slice(0, index).concat(letters.slice(index+1));

		if(rules[letter] && rules[letter] > 0){
			for(var j = 0; j < rules[letter]; j++){
				var forbiddenLetter = rules[letter][j];
				if(string.indexOf(forbiddenLetter) >= 0){
					string = string.substring(0, string.length -1)
				}
			}
		}

		string += letter;
		if(string.length == letterArray.length){
			results.push(string);
			string="";
		} else{
			pickLetterToString(remainingLetters, ++index)
		}
	}
}

permutation(letterArray, cannotPlaceBefore)
