export interface CreateEventDto {
  type: string;
  name: string;
  description?: string;
  startTime: Date;
  durationMin: number;
  animator?: number;
  isOnline?: boolean;
  roomId?: number | null;
  atHomeClientId?: number | null;
}

export type serializedCreateEventDto = Omit<CreateEventDto, "startTime"> & {
  startTime: string;
};

export const serializeCreateEventDto = (
  dto: CreateEventDto
): serializedCreateEventDto => {
  return {
    ...dto,
    startTime: dto.startTime.toISOString(),
  };
};
