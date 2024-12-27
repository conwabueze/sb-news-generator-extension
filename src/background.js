chrome.storage.sync.onChanged.addListener((changes) => {
    if (changes.sbToken) {
      console.log('Token changed:', changes.apiToken.newValue);
    }
  });