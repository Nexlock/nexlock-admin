import { z } from "zod";

export const LockerResponseSchema = z.object({
  id: z.string(),
  lockerId: z.string(),
  moduleId: z.string(),
  createdAt: z.string().transform((val) => new Date(val)),
  updatedAt: z.string().transform((val) => new Date(val)),
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
      startDate: z.string().transform((val) => new Date(val)),
      endDate: z
        .string()
        .transform((val) => new Date(val))
        .nullable(),
      expiresAt: z.string().transform((val) => new Date(val)),
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
        startDate: z.string().transform((val) => new Date(val)),
        endDate: z
          .string()
          .transform((val) => new Date(val))
          .nullable(),
        expiresAt: z.string().transform((val) => new Date(val)),
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
  lastUpdate: z
    .string()
    .transform((val) => new Date(val))
    .nullable(),
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
