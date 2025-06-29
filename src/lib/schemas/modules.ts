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
  description: z.string().nullable(),
  location: z.string().nullable(),
  adminId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lockers: z.array(LockerResponseSchema).optional(),
});

export const UpdateModuleSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  location: z.string().optional(),
});

export type LockerResponse = z.infer<typeof LockerResponseSchema>;
export type ModuleResponse = z.infer<typeof ModuleResponseSchema>;
export type UpdateModuleRequest = z.infer<typeof UpdateModuleSchema>;
