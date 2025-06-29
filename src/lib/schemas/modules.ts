import { z } from "zod";

export const LockerResponseSchema = z.object({
  id: z.string(),
  lockerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ModuleResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  deviceId: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  adminId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lockers: z.array(LockerResponseSchema).optional(),
  isOnline: z.boolean().optional(),
});

export const ModuleStatusSchema = z.object({
  moduleId: z.string(),
  isOnline: z.boolean(),
  lastSeen: z.date().nullable(),
  lockerStatuses: z.array(
    z.object({
      moduleId: z.string(),
      lockerId: z.string(),
      occupied: z.boolean(),
      lastUpdate: z.date(),
    })
  ),
});

export const UpdateModuleSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  location: z.string().optional(),
});

export type LockerResponse = z.infer<typeof LockerResponseSchema>;
export type ModuleResponse = z.infer<typeof ModuleResponseSchema>;
export type UpdateModuleRequest = z.infer<typeof UpdateModuleSchema>;
export type ModuleStatus = z.infer<typeof ModuleStatusSchema>;
