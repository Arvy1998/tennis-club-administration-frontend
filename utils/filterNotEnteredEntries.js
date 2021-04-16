const filterNotEnteredEntries = (entries) => {
    Object.keys(entries).forEach((entryKey) => {
        if (
          entries[entryKey] === undefined || 
          entries[entryKey] === null || 
          entries[entryKey] === "" || 
          entries[entryKey] === 'Not Selected'
        ) {
          delete entries[entryKey];
        }
      });
    
      return entries;
}

export default filterNotEnteredEntries;