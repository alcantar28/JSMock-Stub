export class TrelloLocalDBSync {

    trelloApi: any;
    localDb: any;

    constructor(trelloApi: any, localDb: any) {
        this.trelloApi = trelloApi; // Trello API client
        this.localDb = localDb; // Local database client
    }
  /**
   * Synchronizes Trello board lists/cards with the local database.
   * @param {string} boardId - The ID of the Trello board to sync.
   * @returns {Promise<Object>} - A result object with sync details.
   */
  async syncTrelloWithLocalDB(boardId: any) {
    const result = {
      added: [],
      updated: [],
      skipped: [],
    };

    try {
      // Step 1: Fetch all 'Task' lists from the Trello board
      const trelloLists = await this.fetchTrelloTaskLists(boardId);

      // Step 2: Fetch all tasks from the local database
      const localTasks = await this.fetchLocalTasks();

      // Create a map of local tasks for quick lookup
      const localTasksMap = new Map(localTasks.map((task: any) => [task.id, task]));

      // Step 3: Process each task from Trello
      for (const list of trelloLists) {
        for (const card of list.cards) {
          const localTask = localTasksMap.get(card.id);

          if (!localTask) {
            // Task does not exist in the local database, add it
            await this.addTaskToLocalDB(card);
            result.added.push(card);
            console.log(`Added task: ${card.name}`);
          } else if (this.isTaskUpdated(localTask, card)) {
            // Task exists but has been updated, update it in the local database
            await this.updateTaskInLocalDB(card);
            result.updated.push(card);
            console.log(`Updated task: ${card.name}`);
          } else {
            // Task exists and is unchanged, skip it
            result.skipped.push(card);
            console.log(`Skipped task: ${card.name}`);
          }
        }
      }
    } catch (error) {
      console.error('Error during synchronization:', error);
      throw error;
    }
    return result;
  }

  /**
   * Fetches all 'Task' lists from a Trello board.
   * @param {string} boardId - The ID of the Trello board.
   * @returns {Promise<Array>} - A list of Trello lists with their cards.
   */
  async fetchTrelloTaskLists(boardId: any) {
    // Mockable method to fetch lists from Trello
    const lists = await this.trelloApi.getLists(boardId);
    const taskLists = lists.filter((list: any) => list.name.toLowerCase().includes('task'));

    // Resolve all cards for each list
    return Promise.all(
      taskLists.map(async (list: any) => ({
        ...list,
        cards: await this.trelloApi.getCards(list.id),
      }))
    );
  }

  /**
   * Fetches all tasks from the local database.
   * @returns {Promise<Array>} - A list of tasks from the local database.
   */
  async fetchLocalTasks() {
    // Mockable method to fetch tasks from the local database
    return this.localDb.getTasks();
  }

  /**
   * Adds a new task to the local database.
   * @param {Object} task - The task to add.
   * @returns {Promise<void>}
   */
  async addTaskToLocalDB(task: any) {
    // Mockable method to add a task to the local database
    return this.localDb.addTask(task);
  }

  /**
   * Updates an existing task in the local database.
   * @param {Object} task - The task to update.
   * @returns {Promise<void>}
   */
  async updateTaskInLocalDB(task: any) {
    // Mockable method to update a task in the local database
    return this.localDb.updateTask(task);
  }

  /**
   * Checks if a task has been updated.
   * @param {Object} localTask - The task from the local database.
   * @param {Object} trelloTask - The task from Trello.
   * @returns {boolean} - True if the task has been updated, false otherwise.
   */
  isTaskUpdated(localTask: any, trelloTask: any) {
    return (
      localTask.name !== trelloTask.name ||
      localTask.description !== trelloTask.desc ||
      localTask.dueDate !== trelloTask.due
    );
  }
}