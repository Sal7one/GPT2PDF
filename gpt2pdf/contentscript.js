(() => {
    let chatControl, chatContent;
    let currentChat = "";

    const downloadChatEventHandler = async () => {
        let usrConvos = document.querySelectorAll(`div[data-message-author-role="user"]`);
        let gptConvos = document.querySelectorAll(`div[data-message-author-role="assistant"]`);

        let savedChat = ""
        console.log(usrConvos)
        console.log(gptConvos)
        for(var i = 0; i < usrConvos.length; i++){
            savedChat +="<h3 style='color:#f3278d'><u>Question</u></h3>";
            savedChat +=usrConvos[i].innerHTML
            savedChat +="<h3 style='color:#04a383'><u>ChatGPT Response</u></h3>";
            savedChat +=gptConvos[i].innerHTML
        }

    var pdfWindow = window.open("");
    pdfWindow.document.write(`
        <html>
        <head>
            <title>Chat Transcript</title>
        </head>
        <body>
            <h1 style='font-size:40px; color:#04a383; text-align:center'>Chat Transcript</h1>
            <div>${savedChat}</div>
        </body>
        </html>`);
    pdfWindow.document.close();
    pdfWindow.print();
    pdfWindow.onfocus = function () { pdfWindow.close(); };
    }

    const newChatLoaded = async() => {
            const downloadBtn = document.createElement('button');
            downloadBtn.appendChild(document.createElement('img'));
            downloadBtn.className = "p-1 hover:text-white " + "download-btn";
            downloadBtn.title = 'Click to download chat';
            downloadBtn.firstChild.style = "background-image: url(" + chrome.runtime.getURL("assets/download.png") + "); background-repeat: no-repeat; background-position: center; background-size: 100%; width: 20px; height: 20px; background-color: transparent; border: none;cursor: pointer;";
            const observer = new MutationObserver((mutations, observer) => {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        let ctrl, cont = false;
                        chatControl = document.querySelector("div[role=presentation] button");
                        console.log("button")
                        console.log(chatControl)
                        if (chatControl) {
                            chatControl = document.querySelectorAll("div[role=presentation] button");
                            console.log("buttons")
                            console.log(chatControl)
                            chatControl = chatControl[chatControl.length -1];
                            ctrl = true;
                            if (typeof chatControl !== 'undefined') {
                                chatControl.parentNode.appendChild(downloadBtn);
                            }else{
                                window.location.reload();
                                window.stop();
                            }
                            // observer.disconnect();
                        }

                        chatContent = document.querySelectorAll(`div[data-message-author-role="assistant"]`);
                        if (chatContent) {
                            cont = true;
                            downloadBtn.addEventListener('click', downloadChatEventHandler);
                        }

                        if(ctrl && cont){
                            console.log("Chat control and content found");
                            observer.disconnect();
                        }
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
    }

    chrome.runtime.onMessage.addListener((payload, sender, sendResponse) => {
        const {message, type, chatId} = payload;

        if(message === 'chatId' && type === 'EXISTING') {
            currentChat = chatId;
            newChatLoaded();
        }
    });
})();