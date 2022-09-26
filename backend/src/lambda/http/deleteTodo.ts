import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda';
import {deleteToDo} from "../../helpers/ToDo";
import { createLogger } from '../../utils/logger';
import {parseUserId} from "../../auth/utils";

const logger = createLogger('DeleteTodos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Remove a TODO item by id
    const todoId = event.pathParameters.todoId;
    const auth = event.headers.Authorization;
    const userId = parseUserId(auth.split(' ')[1]);
    logger.info(`Delete todo ${todoId} for user ${userId}`)

    

    const deletetodo = await deleteToDo(todoId, userId);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: deletetodo,
    }
};
