import RNFetchBlob from 'rn-fetch-blob'

const imageURI = 'https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_1MB.jpg';
const downloadSizeInBits = 1000000 * 8;
const metric = 'MbPs';

export const measureConnectionSpeed = () => {
    return new Promise((resolve, reject) => {
        const startTime = (new Date()).getTime();
        RNFetchBlob.config({
            fileCache: false,
        })
            .fetch('GET', imageURI, {})
            .then((res) => {
                const endTime = (new Date()).getTime();
                const duration = (endTime - startTime) / 1000;
                const speed = (downloadSizeInBits / (1024 * 1024 * duration));
                resolve({ metric, speed });
            })
            .catch(reject)
    })
}
