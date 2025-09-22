import { getBoardResponse } from '../models/getBoardModel.ts';

export let getBoardData : getBoardResponse = {
    "id": "abcde123",
    "name": "TestBoard",
    "desc": "Test Board Description",
    "closed": false
}

export let getMultipleLists : any = 
[
    {
        "id": "list1",
        "name": "this is mock testing 1",
        "closed": true,
        "pos": 1,
        "softLimit": "<string>",
        "idBoard": "<string>",
        "subscribed": true,
        "limits": {
        "attachments": {
            "perBoard": {}
        }
        }
    },
    {
        "id": "list2",
        "name": "this is mock testing 2",
        "closed": false,
        "pos": 2,
        "softLimit": "<string>",
        "idBoard": "<string>",
        "subscribed": true,
        "limits": {
        "attachments": {
            "perBoard": {}
        }
        }
    }
]