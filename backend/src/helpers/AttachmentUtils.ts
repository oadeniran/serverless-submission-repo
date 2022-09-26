import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('AttachmentUtils')

// TODO: Implement the fileStogare logic

export class AttachmentUtils{
    constructor(
        private readonly s3bucketClient = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly S3Bucketattachment = process.env.ATTACHMENT_S3_BUCKET,
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