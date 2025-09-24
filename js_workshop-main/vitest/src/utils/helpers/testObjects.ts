import { AxiosHeaders } from 'axios';
import { getBoardData } from '../../test_data/getBoardData.ts';

export class TestObjects{
    incompleteTasks = [
        { id: 1, title: 'Task 1', description: 'Description for Task 1' },
        { id: 2, title: 'Task 2', description: 'Description for Task 2' }
    ];

    trelloCard = {id: 'card1', url: 'https://trello.com/c/card1'};

    processedCards = {
            tasksProcessed: 2,
            trelloLinks: ['https://trello.com/c/card1', 'https://trello.com/c/card1'],
    };

    noIncompleteTasksFound = { message: 'No incomplete tasks found.', tasksProcessed: 0, trelloLinks: [] };

    trelloList = [
        { id: 'mockList', name: 'Mock Task List' }
    ];

    trelloCards = [
        { id: 'mockCard1', name: 'Mock Task 1', desc: 'Updated Description 1', due: '2028-10-01', closed: false },
        { id: 'mockCard2', name: 'Mock Task 2', desc: 'Description 2', due: '2028-10-02', closed: false },
    ];

    trelloTask = [
        { id: 'mockCard1', name: 'Mock Task 1', description: 'Description 1', dueDate: '2028-10-01', closed: true },
    ];

  trelloApiResponse = {
        data: getBoardData as any,
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() }
    };

    compileReportData = { 
        teamStats: {},
        taskSummaries: [
            { taskId: 1, cardTitle: 'Card title', cardDescription: 'Card description', assignedMembers: 1 }
        ],
	    blockedItems: [
            { taskId: 1, reason: 'Incomplete' }
        ]
    };
}