import { trelloConfig } from '../config/config.ts';
import { trelloNoIncompleteTasksFound, incompleteTasks } from '../test_data/trelloData.ts';
import axios from 'axios';// For making HTTP requests to the Trello API

export class TaskWorkflowFunc {
  /**
   * Main function to manage tasks and create Trello cards.
   */
  async manageProjectTasks() {
    try {
      // Step 1: Fetch incomplete tasks from the database
      const incompleteTasks = await this.fetchIncompleteTasksFromDB();

      if (incompleteTasks.length === 0) {
        return trelloNoIncompleteTasksFound;
      }

      const summary = {
        tasksProcessed: 0,
        trelloLinks: [],
      };

      // Step 2: Process each task and create Trello cards
      for (const task of incompleteTasks) {
        const trelloCard = await this.createTrelloCard(task);

        // Step 3: Update the database with the Trello card ID
        await this.updateTaskWithTrelloCardID(task.id, trelloCard.id);

        // Add Trello card link to the summary
        summary.tasksProcessed++;
        summary.trelloLinks.push(`https://trello.com/c/${trelloCard.id}`);
      }

      return summary;
    } catch (error) {
      console.error('Error managing tasks:', error);
      throw new Error('Failed to manage tasks.');
    }
  }

  /**
   * Helper function to fetch incomplete tasks from the database.
   * Mock this function for testing.
   */
  async fetchIncompleteTasksFromDB() {
    // Simulate a database query
    return incompleteTasks;
  }

  /**
   * Helper function to create a Trello card using the Trello API.
   * Mock this function for testing.
   */
  async createTrelloCard(task: any) {
    const { apiKey, token, listId } = trelloConfig;

    const url = `https://api.trello.com/1/cards`;
    const params = {
      key: apiKey,
      token: token,
      idList: listId,
      name: task.title,
      desc: task.description,
    };

    try {
      const response = await axios.post(url, params);
      return response.data; // Returns the Trello card object
    } catch (error) {
      console.error('Error creating Trello card:', error);
      return null;
    }
  }

  /**
   * Helper function to update a task in the database with the Trello card ID.
   * Mock this function for testing.
   */
  async updateTaskWithTrelloCardID(taskId: number, trelloCardId:  number) {
    // Simulate a database update
    console.log(`Task ${taskId} updated with Trello card ID: ${trelloCardId}`);
    return true;
  }
}
