//import 'dotenv/config';
import fs from 'fs-extra';
import Aws from 'aws-sdk';

import Aws_config from '@config/aws';

Aws.config.update(Aws_config.s3);
const s3 = new Aws.S3();

// Lists all S3 Buckets.
export async function getS3Buckets() {
  try {
    const response = await s3.listBuckets().promise();
    return response.Buckets;
    // do something with data here
  } catch (error) {
    // handle your error here
    return { Buckets: null };
  }
}

// Criar um Bucket no S3.
export async function createBucket({ bucketName }) {
  try {
    const response = await s3.createBucket({ Bucket: bucketName }).promise();
    return response;
    // do something with data here
  } catch (error) {
    // handle your error here
    return { error, Location: null };
  }
}

// Upload a file to a S3 Bucket.
export async function uploadFileToBucket({ bucketName, file, customName }) {
  // Read content from the file
  const fileContent = fs.readFileSync(file);

  // Setting up S3 upload parameters
  const params = {
    Bucket: bucketName,
    // Key: customName ? customName : file.filename, // File name you want to save as in S3
    Key: customName, // File name you want to save as in S3
    Body: fileContent
  };

  try {
    const response = await s3.upload(params).promise();
    // console.log(response);
    return response;
    // do something with data here
  } catch (error) {
    console.log(error);
    // handle your error here
    return {
      error
    };
  }
}

// Lists all S3 Bucket Files.
export async function listS3BucketFiles({ bucketName }) {
  try {
    const response = await s3.listObjects({ Bucket: bucketName }).promise();
    return response;
    // do something with data here
  } catch (error) {
    // handle your error here
    return { error };
  }
}

// delete S3 File from a Bucket
export async function deleteS3BucketFiles({ bucketName, fileNames }) {
  const objectsToDelete = async () => {
    const bucketObjects = await listS3BucketFiles(bucketName);
    const filteredObjects = bucketObjects.Contents.filter(item => {
      return fileNames.indexOf(item.Key) > -1;
    });

    return filteredObjects.map(object => ({ Key: object.Key }));
  };

  // console.log("objectsToDelete: ", await objectsToDelete());

  try {
    const response = await s3
      .deleteObjects({
        Bucket: bucketName,
        Delete: {
          Objects: await objectsToDelete(),
          Quiet: true
        }
      })
      .promise();

    return response;
    // do something with data here
  } catch (error) {
    // handle your error here
    return { error };
  }
}

// Get signed URL ( generates a public url of a private S3 bucket File).
export async function getS3SignedUrl({ bucketName, fileName }) {
  const response = s3.getSignedUrlPromise('getObject', {
    Bucket: bucketName,
    Key: fileName
  });

  return response;
}

// Copy file from S3 Bucket to another
export async function copyS3File({
  inputBucketName,
  inputFile,
  targetBuckerName,
  targetFile
}) {
  const copyParams = {
    CopySource: `${inputBucketName}/${inputFile}`,
    Bucket: targetBuckerName,
    Key: `${targetFile}`
  };

  return await s3.copyObject(copyParams).promise();
}

// Copy all files from S3 Bucket to another Bucket
export async function copyS3Folder({
  inputBucketName,
  inputFolder,
  targetBuckerName,
  targetFolder
}) {
  try {
    const listObjectsResponse = await s3
      .listObjects({
        Bucket: inputBucketName,
        Prefix: inputFolder
        // Delimiter: "/"
      })
      .promise();

    const folderContentInfo = listObjectsResponse.Contents;
    const folderPrefix = listObjectsResponse.Prefix;

    await Promise.all(
      folderContentInfo.map(async fileInfo => {
        await s3
          .copyObject({
            Bucket: targetBuckerName,
            CopySource: `${inputBucketName}/${fileInfo.Key}`, // old file Key
            Key: `${targetFolder}${fileInfo.Key.replace(folderPrefix, '')}` // new file Key
          })
          .promise();
      })
    );
    return { message: 'File(s) copied successfully' };
  } catch (err) {
    console.log(err); // error handling
    return err;
  }
}

// get S3 Bucket File ( as Buffer, use .toString() if you want to get the file itself )
export async function getS3BucketFile({ bucketName, fileName }) {
  try {
    const data = await s3
      .getObject({
        Bucket: bucketName,
        Key: fileName
      })
      .promise();

    const mimeType = data.ContentType.toString();

    if (mimeType === 'application/json') {
      const response = JSON.parse(data.Body.toString('utf-8'));
      return response;
    }
    return data.Body.toString('utf-8');

    // do something with data here
  } catch (err) {
    // handle your error here
    console.log(err, err.stack);
  }
}

export async function createS3BucketFile({ bucketName, fileName, body }) {
  const buffer = Buffer.from(body, 'utf-8');
  // const base64data = new Buffer(body, "binary");
  try {
    const data = await s3
      .putObject({
        Bucket: bucketName,
        Key: fileName,
        Body: buffer
      })
      .promise();
    return data;
  } catch (err) {
    console.log(err, err.stack);
  }
}
