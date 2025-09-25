import { AxiosHeaders } from "axios";

export type boardResponse = {
    "id": string,
    "name": string,
    "description": string,
    "dueDate": string,
    "closed": boolean
};

export type apiResponse = {
    "data": boardResponse,
    "status": number,
    "statusText": string,
    "headers": AxiosHeaders,
    "config": { 
        headers: AxiosHeaders
    }
};

export type compileReportData = {
    "trelloTeamStats": any,
    "trelloTaskSummaries": taskSummary,
    "trelloBlockedItems": blockedItems
};

export type list = {
     "idList": string, 
     "name": string
};

export type longList = {
    "id": string,
    "name": string,
    "closed": boolean,
    "pos": number,
    "softLimit": string,
    "idBoard": string,
    "subscribed": boolean,
    "listLimits": limits
}

export type processedCards = {
    "tasksProcessed": number,
    "trelloLinks": string[]
};

export type noIncompleteTasksFound = { 
    "message": string, 
    "tasksProcessed": number, 
    "trelloLinks": string[] 
};

export type card = {
    "id": string, 
    "url": string
};

export type task = { 
    "id": number, 
    "title": string, 
    "description": string
}

export type taskSummary = [{ 
    "taskId": number, 
    "cardTitle": string, 
    "cardDescription": string, 
    "assignedMembers": number
}];

export type blockedItems = [{ 
    "taskId": number, 
    "reason": string 
}]

export type limits = {
    "attachments": {
        "perBoard": any
    }
}