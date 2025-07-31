export enum ResetPasswordResult {
  INVALID_OLD_PASSWORD = 1,
  SUCCESS = 2,
  PASSWORDS_DO_NOT_MATCH = 3,
  USER_NOT_FOUND = 4,
}

export enum CancellBookingResult{
    SUCCESS =1,
    CONFLICT = 2,
    ID_NOT_FOUND = 3,
    EXCEEDED_CANCELLATION_LIMIT =4,
    ALREADY_CANCELLED = 5,
}

