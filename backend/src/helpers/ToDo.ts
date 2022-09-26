import {TodoItem} from "../models/TodoItem";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
import {TodoUpdate} from "../models/TodoUpdate";
import {ToDoAccess} from "./ToDoAccess";
import { createLogger } from '../utils/logger';
import { v4 as uuid } from 'uuid';
import {AttachmentUtils} from "./AttachmentUtils";
const logger = createLogger('todos')


const toDoAccess = new ToDoAccess();
const attachmentUtils = new AttachmentUtils();

export async function getToDosforUser(userId: string): Promise<TodoItem[]> {
    logger.info(`getting all ToDos for user ${userId}.`)
    return toDoAccess.getToDoList(userId);
}

export function createNewToDo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const todoId =  uuid();
    logger.info(`creating a new todo ${todoId} for user ${userId}.`)
    const s3BucketName = process.env.S3_BUCKET_NAME;
    
    return toDoAccess.createToDoItem({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    });
}

export function updateToDo(updateTodoRequest: UpdateTodoRequest, todoId: string, userId: string): Promise<TodoUpdate> {
    return toDoAccess.updateToDoItem(updateTodoRequest, todoId, userId);
}

export function deleteToDo(todoId: string, userId: string): Promise<string> {
    return toDoAccess.deleteToDoItem(todoId, userId);
}

export function generateUploadUrl(todoId: string): Promise<string> {
    return attachmentUtils.generateUploadUrl(todoId);
}