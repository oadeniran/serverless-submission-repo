import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda';

import {getToDosforUser} from "../../helpers/ToDo";
import { createLogger } from '../../utils/logger';
import {parseUserId} from "../../auth/utils";

const logger = createLogger('getTodos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Get all TODO items for a current user
    const auth = event.headers.Authorization;
    const userId = parseUserId(auth.split(' ')[1]);
    logger.info(`Get todos for user ${userId}`)

    const toDosList = await getToDosforUser(userId);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            "items": toDosList,
        }),
    }
};
