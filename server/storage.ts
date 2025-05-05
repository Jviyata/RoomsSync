import { 
  users, User, InsertUser, 
  events, Event, InsertEvent, 
  reminders, Reminder, InsertReminder, 
  guests, Guest, InsertGuest,
  systemStatus, SystemStatus, InsertSystemStatus
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Event methods
  getEvents(): Promise<Event[]>;
  getEventsByUserId(userId: number): Promise<Event[]>;
  getEventsByDate(date: string): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Reminder methods
  getReminders(): Promise<Reminder[]>;
  getRemindersByUserId(userId: number): Promise<Reminder[]>;
  getReminder(id: number): Promise<Reminder | undefined>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminder(id: number, reminder: Partial<InsertReminder>): Promise<Reminder | undefined>;
  deleteReminder(id: number): Promise<boolean>;
  
  // Guest methods
  getGuests(): Promise<Guest[]>;
  getGuestsByUserId(userId: number): Promise<Guest[]>;
  getGuestsByDate(date: string): Promise<Guest[]>;
  getGuest(id: number): Promise<Guest | undefined>;
  createGuest(guest: InsertGuest): Promise<Guest>;
  updateGuest(id: number, guest: Partial<InsertGuest>): Promise<Guest | undefined>;
  deleteGuest(id: number): Promise<boolean>;
  
  // System Status methods
  getSystemStatuses(): Promise<SystemStatus[]>;
  getSystemStatusByName(name: string): Promise<SystemStatus | undefined>;
  updateSystemStatus(name: string, status: Partial<InsertSystemStatus>): Promise<SystemStatus | undefined>;
  createSystemStatus(status: InsertSystemStatus): Promise<SystemStatus>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private reminders: Map<number, Reminder>;
  private guests: Map<number, Guest>;
  private systemStatuses: Map<string, SystemStatus>;
  private currentUserId: number;
  private currentEventId: number;
  private currentReminderId: number;
  private currentGuestId: number;
  private currentSystemStatusId: number;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.reminders = new Map();
    this.guests = new Map();
    this.systemStatuses = new Map();
    this.currentUserId = 1;
    this.currentEventId = 1;
    this.currentReminderId = 1;
    this.currentGuestId = 1;
    this.currentSystemStatusId = 1;
    
    // Initialize with demo user
    this.createUser({
      username: "demouser",
      password: "password123",
      displayName: "Roommate A",
      email: "roommate.a@example.com",
      preferences: {}
    });
    
    // Initialize with demo system statuses
    this.createSystemStatus({
      name: "temperature",
      status: "operational",
      value: "72°F"
    });
    
    this.createSystemStatus({
      name: "doorLock",
      status: "locked",
      value: "Front door is locked"
    });
    
    // Initialize with demo data
    const today = new Date().toISOString().split('T')[0];
    
    // Demo events
    this.createEvent({
      userId: 1,
      title: "Morning Shower",
      space: "Bathroom",
      date: today,
      startTime: "06:00",
      endTime: "06:30",
      description: "Roommate A's shower time",
      isAllDay: false,
      color: "#7A8450",
      attendees: ["Roommate A"]
    });
    
    this.createEvent({
      userId: 1,
      title: "Lunch Prep",
      space: "Kitchen",
      date: today,
      startTime: "12:30",
      endTime: "13:30",
      description: "Roommate A's lunch preparation",
      isAllDay: false,
      color: "#7A8450",
      attendees: ["Roommate A"]
    });
    
    this.createEvent({
      userId: 1,
      title: "Dinner Preparation",
      space: "Kitchen",
      date: today,
      startTime: "18:00",
      endTime: "19:30",
      description: "Isabel's dinner preparation",
      isAllDay: false,
      color: "#7A8450",
      attendees: ["Isabel \"Belly\" Conklin"]
    });
    
    this.createEvent({
      userId: 1,
      title: "Movie Night",
      space: "Living Room",
      date: today,
      startTime: "20:00",
      endTime: "22:00",
      description: "Group movie night",
      isAllDay: false,
      color: "#7A8450",
      attendees: ["Everyone"]
    });
    
    // Demo reminders
    this.createReminder({
      userId: 1,
      text: "Don't forget to take the bins out tonight!",
      fromUser: "Isabel \"Belly\" Conklin",
      priority: "high",
      completed: false
    });
    
    this.createReminder({
      userId: 1,
      text: "It's your turn this week according to the schedule.",
      fromUser: "Isabel \"Belly\" Conklin",
      priority: "medium",
      completed: false
    });
    
    this.createReminder({
      userId: 1,
      text: "Let's clean out old food this weekend.",
      fromUser: "Roommate A",
      priority: "low",
      completed: false
    });
    
    // Demo guests
    this.createGuest({
      userId: 1,
      name: "Jeremiah Fisher",
      relationship: "Visitor",
      visitDate: today,
      visitTime: "19:00",
      visitEndTime: "22:00",
      notes: "Coming over for dinner and movie night. Allergic to nuts.",
      tags: ["Friend", "Dinner Guest"],
      isFirstTime: true
    });
    
    // Tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    this.createGuest({
      userId: 1,
      name: "Steven Conklin",
      relationship: "Visitor",
      visitDate: tomorrowString,
      visitTime: "14:00",
      visitEndTime: "18:00",
      notes: "",
      tags: ["Family"],
      isFirstTime: false
    });
    
    // Weekend date
    const weekend = new Date();
    weekend.setDate(weekend.getDate() + (6 - weekend.getDay()));
    const weekendString = weekend.toISOString().split('T')[0];
    
    this.createGuest({
      userId: 1,
      name: "Conrad Fisher",
      relationship: "Visitor",
      visitDate: weekendString,
      visitTime: "15:00",
      visitEndTime: "19:00",
      notes: "Study session for final exams",
      tags: ["Study", "School"],
      isFirstTime: false
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Event methods
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }
  
  async getEventsByUserId(userId: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.userId === userId
    );
  }
  
  async getEventsByDate(date: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.date === date
    );
  }
  
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }
  
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentEventId++;
    const event: Event = { ...insertEvent, id };
    this.events.set(id, event);
    return event;
  }
  
  async updateEvent(id: number, eventUpdate: Partial<InsertEvent>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...eventUpdate };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }
  
  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }
  
  // Reminder methods
  async getReminders(): Promise<Reminder[]> {
    return Array.from(this.reminders.values());
  }
  
  async getRemindersByUserId(userId: number): Promise<Reminder[]> {
    return Array.from(this.reminders.values()).filter(
      (reminder) => reminder.userId === userId
    );
  }
  
  async getReminder(id: number): Promise<Reminder | undefined> {
    return this.reminders.get(id);
  }
  
  async createReminder(insertReminder: InsertReminder): Promise<Reminder> {
    const id = this.currentReminderId++;
    const createdAt = new Date();
    const reminder: Reminder = { ...insertReminder, id, createdAt };
    this.reminders.set(id, reminder);
    return reminder;
  }
  
  async updateReminder(id: number, reminderUpdate: Partial<InsertReminder>): Promise<Reminder | undefined> {
    const reminder = this.reminders.get(id);
    if (!reminder) return undefined;
    
    const updatedReminder = { ...reminder, ...reminderUpdate };
    this.reminders.set(id, updatedReminder);
    return updatedReminder;
  }
  
  async deleteReminder(id: number): Promise<boolean> {
    return this.reminders.delete(id);
  }
  
  // Guest methods
  async getGuests(): Promise<Guest[]> {
    return Array.from(this.guests.values());
  }
  
  async getGuestsByUserId(userId: number): Promise<Guest[]> {
    return Array.from(this.guests.values()).filter(
      (guest) => guest.userId === userId
    );
  }
  
  async getGuestsByDate(date: string): Promise<Guest[]> {
    return Array.from(this.guests.values()).filter(
      (guest) => guest.visitDate === date
    );
  }
  
  async getGuest(id: number): Promise<Guest | undefined> {
    return this.guests.get(id);
  }
  
  async createGuest(insertGuest: InsertGuest): Promise<Guest> {
    const id = this.currentGuestId++;
    const guest: Guest = { ...insertGuest, id };
    this.guests.set(id, guest);
    return guest;
  }
  
  async updateGuest(id: number, guestUpdate: Partial<InsertGuest>): Promise<Guest | undefined> {
    const guest = this.guests.get(id);
    if (!guest) return undefined;
    
    const updatedGuest = { ...guest, ...guestUpdate };
    this.guests.set(id, updatedGuest);
    return updatedGuest;
  }
  
  async deleteGuest(id: number): Promise<boolean> {
    return this.guests.delete(id);
  }
  
  // System Status methods
  async getSystemStatuses(): Promise<SystemStatus[]> {
    return Array.from(this.systemStatuses.values());
  }
  
  async getSystemStatusByName(name: string): Promise<SystemStatus | undefined> {
    return Array.from(this.systemStatuses.values()).find(
      (status) => status.name === name
    );
  }
  
  async createSystemStatus(insertStatus: InsertSystemStatus): Promise<SystemStatus> {
    const id = this.currentSystemStatusId++;
    const lastUpdated = new Date();
    const status: SystemStatus = { ...insertStatus, id, lastUpdated };
    this.systemStatuses.set(insertStatus.name, status);
    return status;
  }
  
  async updateSystemStatus(name: string, statusUpdate: Partial<InsertSystemStatus>): Promise<SystemStatus | undefined> {
    const status = Array.from(this.systemStatuses.values()).find(
      (s) => s.name === name
    );
    
    if (!status) return undefined;
    
    const lastUpdated = new Date();
    const updatedStatus = { ...status, ...statusUpdate, lastUpdated };
    this.systemStatuses.set(name, updatedStatus);
    return updatedStatus;
  }
}

export const storage = new MemStorage();
