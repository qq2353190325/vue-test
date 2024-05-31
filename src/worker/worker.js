function createChunk (file, i, chunk_Size,identifier) {
    return new Promise((resolve) => {
        const fileIdentifier = identifier
        const start = i * chunk_Size;
        const end = start + chunk_Size;
        const chunk = file.slice(start, end)
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            resolve({
                chunk,
                i,
                fileIdentifier,
            });
        };
        fileReader.readAsArrayBuffer(chunk);
    });
}

self.addEventListener('message', async (e) => {
    const proms = [];
    const { file, CHUNK_SIZE, startIndex, endIndex ,identifier } = e.data;
    for (let i = startIndex; i < endIndex; i++) {
        proms.push(createChunk(file, i, CHUNK_SIZE,identifier));
      }
      const chunks = await Promise.all(proms);
      postMessage(chunks);
});