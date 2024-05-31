//  分片
export function createChunk (file, i, chunk_Size) {
    return new Promise((resolve) => {
        const fileIdentifier = generateFileIdentifier(file);
        const start = i * chunk_Size
        const end = start + chunk_Size
        const chunk = file.slice(start, end)
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            resolve({
                i,
                fileIdentifier,
                chunk
            })
        }
        fileReader.readAsArrayBuffer(chunk)
    })
}