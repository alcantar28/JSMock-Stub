import APIHelper from "../api/common.ts";
import { trelloConfig } from "../../config/config.ts";

const apiHelper = new APIHelper();
export class MockFunctions{

 async reportToDB() {
   // 1. Get board details from Trello API
   const boardDetails = await apiHelper.get(`https://api.trello.com/1/boards/${trelloConfig.trelloID}`);
 
   // 2. Get lists on the board from Trello API
   const lists = await apiHelper.get(`https://api.trello.com/1/boards/${boardDetails.data[0].id}/lists`);
 
   // 3. Create a new card on the specified list
   const newCard = await apiHelper.post(`https://api.trello.com/1/cards`,
      {
        idList: lists.data[0].id,
        name: "New card"
      }
    )
 
   // 4. Get cards on the list from Trello API
   const cards = await apiHelper.get(`https://api.trello.com/1/boards/${boardDetails.data.id}/lists/${lists.data[0].id}/cards`);
 
   // 5. Connect to the database
   const dbConnection = await this.getDatabaseConnection();
 
   // 6. Query the database for some data
   const reportId = (await this.queryDatabase(dbConnection, 'SELECT max(id) FROM some_table')) + 1;
 
   // 7. Process the cards data
   const processedCards = cards.data.map((card: any) => ({
     id: card.id,
     name: card.name,
     description: card.desc,
     dateLastActivity: card.dateLastActivity,
   }));
 
   // 8. Generate a report based on the processed cards
   const report = processedCards.map((card: any) => ({
     id: card.id,
     name: card.name,
     description: card.description,
     lastActivity: new Date(card.dateLastActivity).toLocaleString(),
   }));
 
   // 9. Save the report to the database
   const results = await this.queryDatabase(dbConnection, 'INSERT INTO reports (data) VALUES (?)', {reportId, report});
 
   // 10. Return the final report and board details
   return {
     reportId,
     results,
   };
 }

 async queryDatabase(dbConnection: any, query: any, report?: any): Promise<any>{
  return 0;
 }

 async getDatabaseConnection() {

 }

    async complexLogic({ param1, param2, param3 }: any): Promise<string> {
   if (param1 !== undefined && param2 !== undefined && param3 !== undefined) {
     // All three parameters are provided
     if (param3 === 'sum') {
       return `Sum of ${param1} and ${param2} is ${param1 + param2}`;
     } else if (param3 === 'difference') {
       return `Difference between ${param1} and ${param2} is ${param1 - param2}`;
     } else {
       return `Unknown operation: ${param3}`;
     }
   } 
   
   else if (param1 !== undefined && param2 !== undefined) {
     // Only param1 and param2 are provided
     return `Square of ${param1} is ${param1 ** 2} and square of ${param2} is ${param2 ** 2}`;
   } 
   
   else if (param1 !== undefined && param3 !== undefined) {
     // Only param1 and param3 are provided
     return `Message: ${param3} with value ${param1}`;
   } 
   
   else if (param2 !== undefined && param3 !== undefined) {
     // Only param2 and param3 are provided
     return `Message: ${param3} with value ${param2}`;
   } 
   
   else if (param1 !== undefined) {
     // Only param1 is provided
     return `Square of ${param1} is ${param1 ** 2}`;
   } 
   
   else if (param2 !== undefined) {
     // Only param2 is provided
     return `Square of ${param2} is ${param2 ** 2}`;
   } 
   
   else if (param3 !== undefined) {
     // Only param3 is provided
     return `Message: ${param3}`;
   } 
   
   else {
     // No parameters provided
     return 'No parameters provided';
   }
 }
  // Example usage
  /*
 console.log(complexLogic({ param1: 5, param2: 3, param3: 'sum' })); // Sum of 5 and 3 is 8
 console.log(complexLogic({ param1: 5, param2: 3, param3: 'difference' })); // Difference between 5 and 3 is 2
 console.log(complexLogic({ param1: 5, param2: 3 })); // Square of 5 is 25 and square of 3 is 9
 console.log(complexLogic({ param1: 5, param3: 'Hello' })); // Message: Hello with value 5
 console.log(complexLogic({ param2: 3, param3: 'World' })); // Message: World with value 3
 console.log(complexLogic({ param1: 5 })); // Square of 5 is 25
 console.log(complexLogic({ param2: 3 })); // Square of 3 is 9
 console.log(complexLogic({ param3: 'Hello' })); // Message: Hello
 console.log(complexLogic({})); // No parameters provided
 */
}