export interface Member {
  name: string;
  phone: string;
  dateOfBirth: string;
  customMemberId: string;
  type: MembershipTypeEnum;
}

export interface MemberSearchResults extends Member {
  id: string;
  maxRides: number;
  maxBirthdayFreeRides: number;
  birthdayFreeRidesUsed: number;
  rideUsed: number;
  startDate: string;
  endDate: string;
}

export enum MembershipTypeEnum {
  ORANGE_SLIDE = "Orange Slide",
  FAST_SLIDE = "Fast Slide",
  AIR_SLIDE = "Air Slide",
}

export const MEMBERSHIP_TYPE = {
  [MembershipTypeEnum.ORANGE_SLIDE]: {
    label: MembershipTypeEnum.ORANGE_SLIDE,
    maxRides: 10,
    birthdayFreeRides: 1,
    validForNDays: 90,
  },
  [MembershipTypeEnum.FAST_SLIDE]: {
    label: MembershipTypeEnum.FAST_SLIDE,
    maxRides: 20,
    birthdayFreeRides: 1,
    validForNDays: 180,
  },
  [MembershipTypeEnum.AIR_SLIDE]: {
    label: MembershipTypeEnum.AIR_SLIDE,
    maxRides: 50,
    birthdayFreeRides: 1,
    validForNDays: 365,
  },
};
