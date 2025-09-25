import axios from 'axios';

export class WeeklyReportGenerator {
    db: any;
    trelloApiKey: string;
    trelloToken: string;
    reportDeliveryEndpoint: any;

  constructor(db: any, trelloApiKey: string, trelloToken: string, reportDeliveryEndpoint: any) {
    this.db = db; // Database instance
    this.trelloApiKey = trelloApiKey;
    this.trelloToken = trelloToken;
    this.reportDeliveryEndpoint = reportDeliveryEndpoint;
  }

  // Fetch completed tasks from the database for the current week
  async fetchCompletedTasks() {
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    const endOfWeek = new Date(currentDate.setDate(startOfWeek.getDate() + 6));

    return this.db.query(
      'SELECT * FROM completed_tasks WHERE completed_at BETWEEN ? AND ?',
      [startOfWeek.toISOString(), endOfWeek.toISOString()]
    );
  }

  // Fetch Trello card details using the Trello API
  async fetchTrelloCardDetails(cardId: number) {
    const url = `https://api.trello.com/1/cards/${cardId}`;
    const params = {
      key: this.trelloApiKey,
      token: this.trelloToken,
    };

    try {
      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch Trello card details for card ID ${cardId}:`, error.message);
      return null;
    }
  }

  // Compile the report
  async compileReport(completedTasks: any) {
    const trelloTaskSummaries = [];
    const trelloBlockedItems = [];
    const trelloTeamStats = {};

    for (const task of completedTasks) {
      const cardDetails = await this.fetchTrelloCardDetails(task.trello_card_id);

      if (!cardDetails) {
        trelloBlockedItems.push({
          taskId: task.id,
          reason: 'Failed to fetch Trello card details',
        });
        continue;
      }

      // Update team stats
      cardDetails.idMembers.forEach((memberId: any) => {
        trelloTeamStats[memberId] = (trelloTeamStats[memberId] || 0) + 1;
      });

      // Add task summary
      trelloTaskSummaries.push({
        taskId: task.id,
        cardTitle: cardDetails.name,
        cardDescription: cardDetails.desc,
        assignedMembers: cardDetails.idMembers,
      });
    }

    return {
      trelloTeamStats,
      trelloTaskSummaries,
      trelloBlockedItems,
    };
  }

  // Store the report in the database
  async storeReport(report: any) {
    return this.db.query('INSERT INTO reports (report_data, created_at) VALUES (?, ?)', [
      JSON.stringify(report),
      new Date().toISOString(),
    ]);
  }

  // Send the report to the external API endpoint
  async sendReport(report: any) {
    try {
      const response = await axios.post(this.reportDeliveryEndpoint, report);
      return response.status === 200;
    } catch (error) {
      console.error('Failed to send report to the external API endpoint:', error.message);
      return false;
    }
  }

  // Main function to generate the weekly report
  async generateWeeklyReport() {
    try {
      const completedTasks = await this.fetchCompletedTasks();
      const report = await this.compileReport(completedTasks);

      await this.storeReport(report);

      const deliverySuccess = await this.sendReport(report);

      return deliverySuccess ? 'success' : 'failure';
    } catch (error) {
      console.error('Error generating weekly report:', error.message);
      return 'failure';
    }
  }
}