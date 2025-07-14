import { locations, queries, conversations, type Location, type InsertLocation, type Query, type InsertQuery, type Conversation, type InsertConversation } from "@shared/schema";

export interface IStorage {
  // Location methods
  createLocation(location: InsertLocation): Promise<Location>;
  getLocation(id: number): Promise<Location | undefined>;
  
  // Query methods
  createQuery(query: InsertQuery): Promise<Query>;
  getQueriesByLocation(locationId: number): Promise<Query[]>;
  getQuery(id: number): Promise<Query | undefined>;
  
  // Conversation methods
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversationsBySession(sessionId: string): Promise<Conversation[]>;
}

export class MemStorage implements IStorage {
  private locations: Map<number, Location>;
  private queries: Map<number, Query>;
  private conversations: Map<number, Conversation>;
  private currentLocationId: number;
  private currentQueryId: number;
  private currentConversationId: number;

  constructor() {
    this.locations = new Map();
    this.queries = new Map();
    this.conversations = new Map();
    this.currentLocationId = 1;
    this.currentQueryId = 1;
    this.currentConversationId = 1;
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const id = this.currentLocationId++;
    const location: Location = { 
      ...insertLocation, 
      id,
      createdAt: new Date()
    };
    this.locations.set(id, location);
    return location;
  }

  async getLocation(id: number): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async createQuery(insertQuery: InsertQuery): Promise<Query> {
    const id = this.currentQueryId++;
    const query: Query = {
      ...insertQuery,
      id,
      createdAt: new Date()
    };
    this.queries.set(id, query);
    return query;
  }

  async getQueriesByLocation(locationId: number): Promise<Query[]> {
    return Array.from(this.queries.values()).filter(
      query => query.locationId === locationId
    );
  }

  async getQuery(id: number): Promise<Query | undefined> {
    return this.queries.get(id);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationId++;
    const conversation: Conversation = {
      ...insertConversation,
      id,
      createdAt: new Date()
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversationsBySession(sessionId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).filter(
      conversation => conversation.sessionId === sessionId
    );
  }
}

export const storage = new MemStorage();
