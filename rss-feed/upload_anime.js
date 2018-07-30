require("dotenv").load();
require("isomorphic-fetch");

const fs = require("fs");
const { Dropbox } = require("dropbox");
const dropboxClient = new Dropbox({ accessToken: process.env.DROPBOX_API_TOKEN });

function uploadVideo(filePath, target){
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, async (err, file) => {
      if(err){
        console.log(err);
      }
      else{
        target = "/anime/" + target;
        const MAX_SIZE = 8 * 1000 * 1000;
        let offset = 0;

        const slices = [];

        while (offset <= file.length){
          slices.push(file.slice(offset, offset + MAX_SIZE));
          offset += MAX_SIZE;
        }

        const firstSlice = slices[0];
        const lastSlice = slices[slices.length - 1];


        result = await dropboxClient.filesUploadSessionStart({ 
          contents: firstSlice 
        });
        const sessionId = result.session_id;
        let uploadedBytes = (firstSlice.offset + firstSlice.length);
        console.log(`Uploaded ${(uploadedBytes * 100 / file.length).toFixed(2)}% ${(uploadedBytes / 1000000).toFixed(0)}/${(file.length / 1000000).toFixed(0)} MB`);
        await slices
          .slice(1, slices.length - 1)
          .reduce(
            (promise, slice, i) => {
              return promise
                .then(async result => {
                  return dropboxClient.filesUploadSessionAppend({
                    contents: slice,
                    session_id: sessionId,
                    offset: slice.offset
                  })
                  .then(res => {
                    let uploadedBytes = (slice.offset + slice.length);
                    console.log(`Uploaded ${(uploadedBytes * 100 / file.length).toFixed(2)}% ${(uploadedBytes / 1000000).toFixed(0)}/${(file.length / 1000000).toFixed(0)} MB`);
                  })
                  .catch(err => {
                    console.log(err)
                  });
                });
            }, 
            Promise.resolve()
          );
      await dropboxClient.filesUploadSessionFinish({
          contents: lastSlice,
          cursor: {
            session_id: sessionId,
            offset: lastSlice.offset
          },
          commit: {
            path: target,
            mode: "overwrite",
            mute: false
          }
        })
        .then(res => {
          let uploadedBytes = (lastSlice.offset + lastSlice.length);
          console.log(`Uploaded ${(uploadedBytes * 100 / file.length).toFixed(2)}% ${(uploadedBytes / 1000000).toFixed(0)}/${(file.length / 1000000).toFixed(0)} MB`);
        })
        .catch(err => {
          console.log("finish")
          console.log(err)
        });

        const { url } = await dropboxClient
          .sharingCreateSharedLinkWithSettings({ path: target})
          .catch(console.log);

        resolve(url.replace("dl=0", "raw=1"));
      }
    })
  });
}

module.exports = uploadVideo;