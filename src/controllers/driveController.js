const fs = require('fs');
const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');
const credentials = require('../../../ProvewayCredentials/blog-project-396811-c39221ac9c62');

const auth = new GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const service = google.drive({ version: 'v3', auth });

const downloadVideo = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    const response = await service.files.get({
      fileId: fileId,
      alt: 'media',
    }, { responseType: 'stream' });

    const writer = fs.createWriteStream('downloadedVideo.mp4');
    response.data.pipe(writer);

    return res.status(200).send({ status: true, msg: 'Video downloaded successfully' });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message })
  }
};

const uploadVideoChunk = async (req, res) => {
  // Sending a PUT request to upload a chunk.
  try {
    let currentOffset = 0;
    const fileId = req.params.fileId;
    const offset = currentOffset;
    const chunkSize = 1024 * 1024; // 1MB chunk size

    // Read a chunk of data from the video file
    const chunk = await readChunkFromFile('downloadedVideo.mp4', offset, chunkSize);

    const response = await service.files.update({
      fileId: fileId,
      media: {
        body: chunk,
      },
      uploadType: 'media',
      // Add the 'Content-Range' header to specify the byte range being uploaded
      headers: {
        'Content-Range': `bytes ${offset}-${offset + chunk.length - 1}/${offset + chunk.length}`,
      },
    });

    // Update current offset
    currentOffset += chunk.length;

      return res.status(200).send({ status: true, msg: 'Video chunk uploaded successfully' });
    //}
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const readChunkFromFile = (filePath, offset, length) => {
  return new Promise((resolve, reject) => {
    fs.open(filePath, 'r', (err, fd) => {
      if (err) {
        reject(err);
        return;
      }

      const buffer = Buffer.alloc(length);
      fs.read(fd, buffer, 0, length, offset, (err, bytesRead, buffer) => {
        if (err) {
          reject(err);
          return;
        }

        fs.close(fd, (err) => {
          if (err) {
            reject(err);
            return;
          }
          const resultBuffer = Buffer.from(buffer.buffer, buffer.byteOffset, bytesRead);

          resolve(resultBuffer);        });
      });
    });
  });
};
module.exports = { downloadVideo, uploadVideoChunk }
