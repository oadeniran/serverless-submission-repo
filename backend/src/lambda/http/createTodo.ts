import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {CreateTodoRequest} from '../../requests/CreateTodoRequest';
import {createNewToDo} from "../../helpers/ToDo";
import { createLogger } from '../../utils/logger';
import {parseUserId} from "../auth/utils";

const logger = createLogger('Createtodos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Implement creating a new TODO item
    console.log("Processing Event ", event);
    const auth = event.headers.Authorization;
    const split = auth.split(' ');
    const jwtToken = split[1];
    const userId = parseUserId(jwtToken);
    logger.info(`Process a create todo event for ${userId}`)

    const newTodo: CreateTodoRequest = JSON.parse(event.body);
    const toDoItem = await createNewToDo(newTodo, userId);

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
