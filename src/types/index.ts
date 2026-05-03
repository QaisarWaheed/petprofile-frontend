export type LogType =
  | 'meal'
  | 'walk'
  | 'mood'
  | 'behaviour'
  | 'symptom'
  | 'medication'
  | 'vet_visit'
  | 'grooming'
  | 'expense'
  | 'weight'
  | 'training';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  role: 'primary' | 'secondary';
  subscriptionPlan: 'free' | 'basic' | 'premium';
  subscriptionStatus: 'active' | 'inactive' | 'trial';
  trialEndsAt?: string;
  rewardPoints?: number;
  streakCount?: number;
  lastLogDate?: string;
  referralCode?: string;
  referredBy?: string;
  pushToken?: string;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PetHealth {
  isNeutered?: boolean;
  allergies?: string[];
  conditions?: string[];
  medications?: string[];
  lastVetVisit?: string;
  vetClinic?: string;
  vetPhone?: string;
  vaccines?: { name: string; date?: string; nextDue?: string }[];
}

export interface PetBehaviour {
  mealTimes?: string[];
  walkSchedule?: string;
  traits?: string[];
  trainingLevel?: string;
  knownCommands?: string[];
  favouriteToys?: string[];
}

export interface Pet {
  id: string;
  name: string;
  species: 'cat' | 'dog';
  breed?: string;
  dateOfBirth?: string;
  gender: 'male' | 'female';
  weight?: number;
  profilePhoto?: string;
  photos?: string[];
  owners?: { userId: string; role: 'primary' | 'secondary' }[];
  health?: PetHealth;
  behaviour?: PetBehaviour;
  grooming?: {
    lastGroomingDate?: string;
    frequencyWeeks?: number;
    atHomeRoutine?: string;
  };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Log {
  id: string;
  petId: string;
  userId: string;
  type: LogType;
  data: Record<string, unknown>;
  isValidated?: boolean;
  pointsAwarded?: number;
  voiceTranscript?: string;
  attachments?: string[];
  loggedAt: string;
  createdAt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface Document {
  id: string;
  petId: string;
  userId: string;
  url: string;
  publicId: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  createdAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface RewardTransaction {
  id: string;
  userId: string;
  amountCents: number;
  logId?: string;
  type: 'award' | 'redeem';
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}
