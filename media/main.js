// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();
    vscode.setState({
        lines: []
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
            case 'addline':
                var oldLines = vscode.getState()['lines'];

                var mainDiv = document.getElementById("main");

                var lineDiv = document.createElement("div");
                lineDiv.setAttribute("id", "line" + oldLines.length);
                var lineContent = document.createTextNode(message.line); 
                lineDiv.appendChild(lineContent);
                if (message.line === "") {
                    var br = document.createElement("br");
                    lineDiv.appendChild(br);
                }

                var resultSpan = document.createElement("span");
                resultSpan.setAttribute("id", "result");
                lineDiv.appendChild(resultSpan);

                var timeSpan = document.createElement("span");
                timeSpan.setAttribute("id", "time");
                lineDiv.appendChild(timeSpan);

                mainDiv.appendChild(lineDiv);

                var newLines = oldLines.push(message.line);
                vscode.setState({ lines: newLines });
                break;
        }
    });
}());
