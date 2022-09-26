import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";
import { createLogger } from '../utils/logger';

const logger = createLogger('TodosAccess')


export class ToDoAccess {
    constructor(
        private readonly documentClient: DocumentClient = new DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE) {}

    async getToDoList(uId: string): Promise<TodoItem[]> {
        logger.info(`Get a list of all todos for user ${uId}`);
        const res = await this.documentClient
            .query({
                TableName: this.todosTable,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': uId
                }
            })
            .promise()
            return res.Items as TodoItem[]
    }

    async createToDoItem(todoItem: TodoItem): Promise<TodoItem> {
        logger.info(`Create a new todo - ${todoItem.todoId}`);

        const res = await this.documentClient.put({
            TableName: this.todosTable,
            Item: todoItem,
        }).promise();

        logger.info(res);

        return todoItem as TodoItem;
    }

    async updateToDoItem(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {
        logger.info(`Processing new information for todo: ${todoId}`);

        const updatedTodo = await this.documentClient.update({
            TableName: this.todosTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
            UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
            ExpressionAttributeNames: {
            '#name': 'name',
            '#duedate': 'dueDate',
            '#done': 'done'
            },
            ExpressionAttributeValues: {
            ':name': todoUpdate['name'],
            ':dueDate': todoUpdate['dueDate'],
            ':done': todoUpdate['done']
            },
            ReturnValues: "ALL_NEW"
        }).promise();
        logger.info(updatedTodo);

        return updatedTodo.Attributes as TodoUpdate;
    }

    async deleteToDoItem(todoId: string, userId: string): Promise<string> {
        logger.info(`Delete todo: ${todoId}`);

        const deleteresp = await this.documentClient.delete({
            TableName: this.todosTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
        }).promise();
        logger.info(deleteresp)

        return "DONE" as string;
    }
}
