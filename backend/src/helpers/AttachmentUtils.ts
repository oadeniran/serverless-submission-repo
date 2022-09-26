import * as AWS from 'aws-sdk';
import {Types} from 'aws-sdk/clients/s3';
import { createLogger } from '../utils/logger';


const logger = createLogger('AttachmentUtils')

// TODO: Implement the fileStogare logic

export class AttachmentUtils{
    constructor(
        private readonly s3bucketClient: Types = new AWS.S3({ signatureVersion: 'v4' }),
        private readonly S3Bucketattachment = process.env.S3_BUCKET_NAME,
    ){}


    async generateUploadUrl(todoId: string): Promise<string> {
        logger.info("Generating URL");

        const url = this.s3bucketClient.getSignedUrl('putObject', {
            Bucket: this.S3Bucketattachment,
            Key: todoId,
            Expires: 1000,
        });
        logger.info(url);

        return url as string;
    }
}