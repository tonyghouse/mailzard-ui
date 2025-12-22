
export interface Contact {
  id: number;

  email: string;
  firstName?: string | null;
  lastName?: string | null;

  isSubscribed: boolean;

  userId: string;
}
