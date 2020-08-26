// This script will be run within the webview itself

// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();
    vscode.setState({
        questions: [],
        answers: [],
        startTimes: [],
    });

    // const oldState = vscode.getState();

    /*
    const counter = document.getElementById('lines-of-code-counter');
    console.log(oldState);
    let currentCount = (oldState && oldState.count) || 0;
    counter.textContent = currentCount;
    */

    /*
    setInterval(() => {
        counter.textContent = currentCount++;

        // Update state
        vscode.setState({ count: currentCount });

        // Alert the extension when the cat introduces a bug
        if (Math.random() < Math.min(0.001 * currentCount, 0.05)) {
            // Send a message back to the extension
            vscode.postMessage({
                command: 'alert',
                text: '🐛  on line ' + currentCount
            });
        }
    }, 100);
    */

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.command) {
            case 'addQuestion':
                var questions = vscode.getState()['questions'];
                var answers = vscode.getState()['answers'];
                var startTimes = vscode.getState()['startTimes'];

                var mainDiv = document.getElementById("main");

                var questionDiv = document.createElement("div");
                var line = questions.length;
                questionDiv.setAttribute("id", "question" + line);
                var questionContent = document.createTextNode(message.question); 
                questionDiv.appendChild(questionContent);
                if (message.question === "") {
                    var br = document.createElement("br");
                    questionDiv.appendChild(br);
                }

                var resultSpan = document.createElement("span");
                resultSpan.setAttribute("id", "result" + line);
                questionDiv.appendChild(resultSpan);

                var timeSpan = document.createElement("span");
                timeSpan.setAttribute("id", "time" + line);
                questionDiv.appendChild(timeSpan);

                mainDiv.appendChild(questionDiv);

                questions.push(message.question);
                answers.push('');
                startTimes.push(null);
                vscode.setState({ questions: questions, answers: answers, startTimes: startTimes });
                break;
            case 'setAnswer':
                var questions = vscode.getState()['questions'];
                var answers = vscode.getState()['answers'];
                var startTimes = vscode.getState()['startTimes'];

                answers[message.line] = message.answer;

                if (questions[message.line] !== "") {
                    if (questions[message.line] === answers[message.line]) {
                        var resultSpan = document.getElementById("result" + message.line);
                        resultSpan.textContent = " Done";
                    }

                    if (answers[message.line].length === 0) {
                        startTimes[message.line] = null;
                    } else if (answers[message.line].length === 1) {
                        startTimes[message.line] = Date.now();
                    }

                    var timeSpan = document.getElementById("time" + message.line);
                    if(startTimes[message.line] === null) {
                        timeSpan.textContent = "";
                    } else {
                        timeSpan.textContent = " " + (Date.now() - startTimes[message.line]);
                    }
                }

                vscode.setState({ questions: questions, answers: answers, startTimes: startTimes});

        }
    });
}());
