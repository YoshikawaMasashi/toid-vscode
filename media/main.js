// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();
    vscode.setState({
        questions: [],
        answers: [],
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
                var oldQuestions = vscode.getState()['questions'];
                var oldAnswers = vscode.getState()['answers'];

                var mainDiv = document.getElementById("main");

                var questionDiv = document.createElement("div");
                var line = oldQuestions.length;
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

                oldQuestions.push(message.question);
                oldAnswers.push('');
                vscode.setState({ questions: oldQuestions, answers: oldAnswers });
                break;
            case 'setAnswer':
                var oldQuestions = vscode.getState()['questions'];
                var oldAnswers = vscode.getState()['answers'];

                oldAnswers[message.line] = message.answer;

                if (oldQuestions[message.line] !== "" && oldQuestions[message.line] === oldAnswers[message.line]) {
                    var resultSpan = document.getElementById("result" + message.line);
                    resultSpan.textContent = " Done";
                }

                vscode.setState({ questions: oldQuestions, answers: oldAnswers});

        }
    });
}());
