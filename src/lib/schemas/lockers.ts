import { z } from "zod";

export const LockerResponseSchema = z.object({
  id: z.string(),
  lockerId: z.string(),
  moduleId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  module: z
    .object({
      id: z.string(),
      name: z.string(),
      deviceId: z.string(),
    })
    .optional(),
  currentRental: z
    .object({
      id: z.string(),
      userId: z.string(),
      startDate: z.date(),
      expiresAt: z.date(),
      isLocked: z.boolean(),
      user: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
      }),
    })
    .nullable(),
  rentals: z
    .array(
      z.object({
        id: z.string(),
        userId: z.string(),
        startDate: z.date(),
        expiresAt: z.date(),
        isLocked: z.boolean(),
        user: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
        }),
      })
    )
    .optional(),
});

export const LockerStatusSchema = z.object({
  lockerId: z.string(),
  moduleId: z.string(),
  isOnline: z.boolean(),
  isOccupied: z.boolean(),
  lastUpdate: z.date().nullable(),
});

export const AdminUnlockRequestSchema = z.object({
  lockerId: z.string(),
  reason: z.string().optional(),
});

export const ForceCheckoutRequestSchema = z.object({
  rentalId: z.string(),
  reason: z.string().optional(),
});

export const LockerStatsSchema = z.object({
  totalLockers: z.number(),
  availableLockers: z.number(),
  occupiedLockers: z.number(),
  offlineLockers: z.number(),
  activeRentals: z.number(),
});

export type LockerResponse = z.infer<typeof LockerResponseSchema>;
export type LockerStatus = z.infer<typeof LockerStatusSchema>;
export type AdminUnlockRequest = z.infer<typeof AdminUnlockRequestSchema>;
export type ForceCheckoutRequest = z.infer<typeof ForceCheckoutRequestSchema>;
export type LockerStats = z.infer<typeof LockerStatsSchema>;
