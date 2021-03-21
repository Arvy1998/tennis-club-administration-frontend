const filterNotEnteredEntries = (entries) => {
    Object.keys(entries).forEach((entryKey) => {
        if (!entries[entryKey] || entries[entryKey] === "") {
          delete entries[entryKey];
        }
      });

      console.log({entries});
    
      return entries;
}

export default filterNotEnteredEntries;