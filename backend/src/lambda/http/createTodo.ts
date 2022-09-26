import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {CreateTodoRequest} from '../../requests/CreateTodoRequest';
import {createNewToDo} from "../../helpers/ToDo";
import { createLogger } from '../../utils/logger';
import {getUserId} from "../utils";

const logger = createLogger('Createtodos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Implement creating a new TODO item
    const userId = getUserId(event);
    logger.info(`Process a create todo event for ${userId}`)

    const newTodoItem: CreateTodoRequest = JSON.parse(event.body);
    const toDoItem = await createNewToDo(newTodoItem, userId);

    return {
        statusCode: 201,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            "item": toDoItem
        }),
    }
};
