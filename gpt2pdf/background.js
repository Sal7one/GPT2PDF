// chrome.tabs.reload();
chrome.tabs.onUpdated.addListener((tabId,changeInfo, tab) => {
    if (tab.url && tab.url.includes("chatgpt.com/c") && changeInfo.status === "complete") {
        
        const queryParameters = tab.url.split('c/')[1] === undefined ? "new_chat" : tab.url.split('c/')[1];
        const tabtype = queryParameters == "new_chat" ? "NEW" : "EXISTING";
        console.log(queryParameters);

        chrome.tabs.sendMessage(tabId, {
            message: 'chatId',
            type: tabtype,
            chatId: queryParameters
        });
    }
});
