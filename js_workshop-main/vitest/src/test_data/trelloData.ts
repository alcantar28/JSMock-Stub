import { 
    apiResponse, 
    boardResponse, 
    compileReportData, 
    list, 
    processedCards, 
    noIncompleteTasksFound,
    card,
    task, 
    longList
} from '../models/trelloModel.ts';
import { AxiosHeaders } from 'axios';

export const  getBoardData : boardResponse = {
    "id": "abcde123",
    "name": "TestBoard",
    "description": "Test Board Description",
    "dueDate": '2028-12-31',
    "closed": false
}

export const getMultipleLists : longList[] = 
[
    {
        id: "list1",
        name: "this is mock testing list 1",
        closed: true,
        pos: 1,
        softLimit: "<string>",
        idBoard: "<string>",
        subscribed: true,
        listLimits: {
            attachments: {
                perBoard: {}
            }
        }
    },
    {
        id: "list2",
        name: "this is mock testing list 2",
        closed: false,
        pos: 2,
        softLimit: "<string>",
        idBoard: "<string>",
        subscribed: true,
        listLimits: {
            attachments: {
                perBoard: {}
            }
        }
    }
]

export const incompleteTasks: task[] = [
    { id: 1, title: 'Task 1', description: 'Description for Task 1' },
    { id: 2, title: 'Task 2', description: 'Description for Task 2' }
];

export const trelloCard: card = {id: 'card1', url: 'https://trello.com/c/card1'};

export const trelloProcessedCards: processedCards = {
        tasksProcessed: 2,
        trelloLinks: ['https://trello.com/c/card1', 'https://trello.com/c/card1'],
};

export const trelloNoIncompleteTasksFound: noIncompleteTasksFound = { 
    message: 'No incomplete tasks found.', tasksProcessed: 0, trelloLinks: [] 
};

export const trelloList: list[] = [
    { idList: 'mockList', name: 'Mock Task List' }
];

export const trelloCards : boardResponse[] = [
    { id: 'mockCard1', name: 'Mock Task 1', description: 'Updated Description 1', dueDate: '2028-10-01', closed: false },
    { id: 'mockCard2', name: 'Mock Task 2', description: 'Description 2', dueDate: '2028-10-02', closed: false },
];

export const trelloTask : boardResponse[]  = [
    { id: 'mockCard1', name: 'Mock Task 1', description: 'Description 1', dueDate: '2028-10-01', closed: true },
];

export const trelloApiResponse: apiResponse = {
    data: getBoardData as any,
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() }
};

export const trelloCompileReportData: compileReportData = { 
    trelloTeamStats: {},
    trelloTaskSummaries: [
        { taskId: 1, cardTitle: 'Card title', cardDescription: 'Card description', assignedMembers: 1 }
    ],
    trelloBlockedItems: [
        { taskId: 1, reason: 'Incomplete' }
    ]
};
