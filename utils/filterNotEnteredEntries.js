const filterNotEnteredEntries = (entries) => {
    Object.keys(entries).forEach((entryKey) => {
        if (!entries[entryKey] || entries[entryKey] === "") {
          delete entries[entryKey];
        }
      });
    
      return entries;
}

export default filterNotEnteredEntries;