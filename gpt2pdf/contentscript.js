(() => {
    let chatControl, chatContent;

    const downloadChatEventHandler = async () => {
        let usrConvos = document.querySelectorAll(`div[data-message-author-role="user"]`);
        let gptConvos = document.querySelectorAll(`div[data-message-author-role="assistant"]`);

        let savedChat = ""
        for(var i = 0; i < usrConvos.length; i++){
            savedChat +="<h3 style='color:#f3278d'><u>Question</u></h3>";
            savedChat += removeSvgs(usrConvos[i]).innerHTML
            savedChat +="<h3 style='color:#04a383'><u>ChatGPT Response</u></h3>";
            savedChat += removeSvgs(gptConvos[i]).innerHTML
        }

    var pdfWindow = window.open("");
    pdfWindow.document.write(`
        <html>
        <head>
            <title>Transcript ${getCurrentDateTime()}</title>
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
                        if (chatControl) {
                            chatControl = document.querySelectorAll("div[role=presentation] button");
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

function removeSvgs(parent) {
    try {
        for (let i = 0; i < parent.children.length; i++) {
            const child = parent.children[i];
            if (child.tagName.toLowerCase() === 'button') {
                console.log("button found");
                const svg = child.querySelector('svg');
                if (svg) {
                    console.log("svg found");
                    parent.removeChild(child);
                    i--;
                }
            } else {
                // Recursively check the child element
                removeSvgs(child);
            }
        }
        return parent;
    } catch (error) {
        console.log(error.message);
        return parent;
    }
}


function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    let strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    return strTime;
  }
  
  function formatDate(date) {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    return day + ' ' + month;
  }
  
  function getCurrentDateTime() {
    const now = new Date();
    const time = formatTime(now);
    const date = formatDate(now);
    return time + ' ' + date;
  }
  