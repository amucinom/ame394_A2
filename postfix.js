function calculatePostfix() {
    var infix = document.getElementById("inputEq").value;
    var tokens = [];
    for (var i = 0; i < infix.length; i++) {
        if (infix[i] != " ") {
            tokens[tokens.length] = infix[i];
        }
    }
    getPostfix(tokens);
    console.log(tokens);

}

var stackObj = {
    content: [],
    push: function(val) {
        stackObj.content[stackObj.content.length] = val;
    },
    pop: function() {
        var top = stackObj.getTop();
        if (top !== null) {
            stackObj.content = stackObj.content.splice(0, stackObj.content.length - 1);
        }
        return top;
    },
    getTop: function() {
        if (stackObj.content.length === 0) {
            return null;
        }
        return stackObj.content[stackObj.content.length - 1];
    },
    initialize: function(initStack) {
        stackObj.content = initStack;
    }
};

function updateVisualization(step, tokens, postfix) {
    var outS = "<hr><h1>Step " + (step + 1) + "</h1>";
    //update infix
    outS += "<div>";
    var infix = document.getElementById("inputEq").value;
    outS += "<h2>Infix:</h2>";
    for (var i = 0; i < tokens.length; i++) {
        if (i == step) {
            outS += "<span class='smallBox'><b>" + tokens[i] + "</b></span>";
        } else {
            outS += "<span class='smallBox'>" + tokens[i] + "</span>";
        }
    }
    outS += "</div>";

    //update stack
    tokens = stackObj.content;
    // console.log('here are the tokens' + tokens);
    outS += "<div>";
    outS += "<h2>Stack:</h2>";
    for (i = 0; i < tokens.length; i++) {
        outS += "<span class='smallBox'>" + tokens[i] + "</span>";
    }
    outS += "<span class='smallBox'><b>&lt;-</b></span>";
    outS += "</div>";

    //update postfix string
    tokens = postfix;
    outS += "<div>";
    outS += "<h2>Postfix:</h2>";
    for (i = 0; i < tokens.length; i++) {
        if (i == step) {
            outS += "<span class='smallBox'><b>" + tokens[i] + "</b></span>";
        } else {
            outS += "<span class='smallBox'>" + tokens[i] + "</span>";
        }
    }
    outS += "</div>";
    document.getElementById("visual").innerHTML += outS;
    // console.log(typeof tokens);
}

var operators = ["*", "/", "+", "-", "^"];
var parens = ["(", ")"];

function isLeftParens (t) {
    for (var i = 0; i < parens.length; i++) {
        if (parens[i] === "(") {
            return true;
        }
        return false;
    }
}

function isRightParens (t) {
    for (var i = 0; i < parens.length; i++) {
        if (parens[i] === ")") {
            return true;
        }
        return false;
    }
}

function isOperator(t) {
    if (operators.indexOf(t) >= 0) {
        return true;
    }
    return false;
}

function isPrecGreater(a, b) {
    var pn1 = 1;
    var pn2 = 1;
    if (a == "^") {
        pn1 = 3;
    }
    if (b == "^") {
        pn2 = 3;
    }
    if (a == "*" || a == "/") {
        pn1 = 2;
    }
    if (b == "*" || b == "/") {
        pn2 = 2;
    }
    console.log(pn1, pn2);
    if (pn1 >= pn2) {
        return true;
    }
    return false;
}

function getPostfix(tokens) {
    var postFix = "";
    stackObj.initialize([]);
    document.getElementById("visual").innerHTML = "";
    for (var i = 0; i < tokens.length; i++) {
        var currScan = tokens[i];
        console.log(currScan);
        if (isOperator(currScan)) { // is operator
            var top = stackObj.getTop();
            if (top !== null) { // stack not empty
                while (top !== null && top && isPrecGreater(top, currScan)) {
                    postFix += stackObj.pop();
                    top = stackObj.getTop();
                }
                stackObj.push(currScan);
            } else if(isLeftParens(currScan)) {
                stackObj.push(currScan);
            } else if(isRightParens(currScan)) {
                var popped = stackObj.pop();
                while(isLeftParens(popped) === false) {
                    postFix += stackObj.push(currScan);
                    stackObj.pop();
                }
            }
            else { //stack is empty
                stackObj.push(currScan);
            }
        } else { // is NOT an operator
            postFix = postFix + currScan;
        }
        updateVisualization(i, tokens, postFix);
    }

    var top = stackObj.getTop();
    if (top !== null) {
        document.getElementById("visual").innerHTML += "<h1> Popping stack....</h1>";
        while (top) {
            postFix += stackObj.pop();
            top = stackObj.getTop();
        }
    }


    updateVisualization(i, tokens, postFix);

    document.getElementById("visual").innerHTML += "<h1> Result: " + postFix + "</h1><hr>";


    return postFix;
}

function allClear() {
    document.getElementById("visual").innerHTML = "";
    document.getElementById("inputEq").value = "";
}