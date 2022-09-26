import 'source-map-support/register'
import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {UpdateTodoRequest} from '../../requests/UpdateTodoRequest'
import {updateToDo} from "../../helpers/ToDo";

import { createLogger } from '../../utils/logger';
import {getUserId} from "../utils";

const logger = createLogger('Updatetodos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    const userId = getUserId(event);
    const todoId = event.pathParameters.todoId;

    logger.info(`Update todo ${todoId} for user ${userId} `)

    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
    const newtoDoItem = await updateToDo(updatedTodo, todoId, userId);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            "item": newtoDoItem
        }),
    }
};
