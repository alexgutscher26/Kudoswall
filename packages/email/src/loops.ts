export interface CreateContactInput {
  email: string;
  firstName?: string;
  lastName?: string;
  userGroup?: string;
  source?: string;
  subscribed?: boolean;
}

export interface UpdateContactInput {
  email: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  userGroup?: string;
  source?: string;
  subscribed?: boolean;
  [key: string]: any; // Allow custom contact properties
}

export interface SendEventInput {
  email?: string;
  userId?: string;
  eventName: string;
  eventProperties?: Record<string, any>;
}

export interface SendTransactionalInput {
  email: string;
  transactionalId: string;
  dataVariables?: Record<string, any>;
  addToAudience?: boolean;
}

export class LoopsService {
  private apiKey: string;
  private baseUrl = "https://app.loops.so/api/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createContact(input: CreateContactInput) {
    try {
      const response = await fetch(`${this.baseUrl}/contacts/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Loops API Error] Status: ${response.status}, Body: ${errorText}`);
        throw new Error(`Loops API responded with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("[Loops API Request Failed]", error);
      throw error;
    }
  }

  async updateContact(input: UpdateContactInput) {
    try {
      const response = await fetch(`${this.baseUrl}/contacts/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Loops API Error] Status: ${response.status}, Body: ${errorText}`);
        throw new Error(`Loops API responded with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("[Loops API Request Failed]", error);
      throw error;
    }
  }

  async sendEvent(input: SendEventInput) {
    try {
      const response = await fetch(`${this.baseUrl}/events/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Loops API Error] Status: ${response.status}, Body: ${errorText}`);
        throw new Error(`Loops API responded with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("[Loops API Request Failed]", error);
      throw error;
    }
  }

  async sendTransactional(input: SendTransactionalInput) {
    try {
      const response = await fetch(`${this.baseUrl}/transactional`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Loops API Error] Status: ${response.status}, Body: ${errorText}`);
        throw new Error(`Loops API responded with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("[Loops API Request Failed]", error);
      throw error;
    }
  }
}
