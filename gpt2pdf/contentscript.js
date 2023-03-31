(() => {
    let chatControl, chatContent;
    let currentChat = "";
    let reloadCount = 0;

    const downloadChatEventHandler = async () => {
        // console.log("Download button clicked");
        var message = chatContent.cloneNode(true);
        var btns = message.getElementsByTagName('button');
        for (var i = 0; i < btns.length; i++) {
            btns[i].style.display = 'none';
        }
        const usr = message.getElementsByClassName('w-[30px] flex flex-col relative items-end');
        for(var i = 0; i < usr.length; i++){
            if(usr[i].getElementsByTagName('path').length == 0){
                usr[i].innerHTML = "<h3 style='color:#f3278d'><u>Question</u></h3>";
            }else{
                usr[i].innerHTML = "<h3 style='color:#04a383'><u>ChatGPT Response</u></h3>";
            }
        }
        var pdfWindow = window.open("GPT2PDF");
        pdfWindow.document.write("<html><head><title style='font-size:20px'>GPT2PDF</title></head><body> <h1 style='font-size:40px;color:#04a383;text-align:center'> Topic:" + document.querySelector(".pr-14").innerText+  "</h1>"  + message.innerHTML + "</body></html>");
        pdfWindow.document.close();
        pdfWindow.print();
        pdfWindow.onfocus = function(){pdfWindow.close();}
    }

    const newChatLoaded = async() => {
        // console.log("Download Button: " + document.querySelector(".download-btn"));

        if(document.getElementsByClassName('download-btn')[0]=== undefined){

            const downloadBtn = document.createElement('button');
            downloadBtn.appendChild(document.createElement('img'));
            downloadBtn.className = "p-1 hover:text-white " + "download-btn";
            downloadBtn.title = 'Click to download chat';
            downloadBtn.firstChild.style = "background-image: url(" + chrome.runtime.getURL("assets/download.png") + "); background-repeat: no-repeat; background-position: center; background-size: 100%; width: 20px; height: 20px; background-color: transparent; border: none;cursor: pointer;";

            const observer = new MutationObserver((mutations, observer) => {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        let ctrl, cont = false;
                        chatControl = document.getElementsByClassName("pr-14")[0];
                        // console.log("Chat Control" +chatControl);
                        if (chatControl) {
                            ctrl = true;
                            // console.log("Chat control found");
                            chatControl = chatControl.getElementsByClassName('absolute flex right-1 z-10 text-gray-300 visible')[0];
                            if (typeof chatControl !== 'undefined') {
                                chatControl.appendChild(downloadBtn);
                            }else{
                                window.location.reload();
                                window.stop();
                            }
                            // observer.disconnect();
                        }

                        chatContent = document.getElementsByClassName("flex flex-col items-center text-sm dark:bg-gray-800")[0];
                        if (chatContent) {
                            cont = true;
                            // console.log("Chat content found");
                            downloadBtn.addEventListener('click', downloadChatEventHandler);
                            // observer.disconnect();
                        }

                        if(ctrl && cont){
                            // console.log("Chat control and content found");
                            observer.disconnect();
                        }
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
        
    }

    chrome.runtime.onMessage.addListener((payload, sender, sendResponse) => {
        const {message, type, chatId} = payload;

        if(message === 'chatId' && type === 'EXISTING') {
            // console.log("Message received: " + message + " " + type + " " + chatId);
            currentChat = chatId;
            newChatLoaded();
        }
    });

})();