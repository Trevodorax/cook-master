export interface CookMasterSubscription {
  displayedName: string;
  productName: string;
  subscriptionLevel: number;
  price: number;
  benefits: {
    noAds: boolean;
    canComment: boolean;
    accessLimitedToOneLessonPerDay: boolean;
    accessLimitedToFiveLessonsPerDay: boolean;
    unlimitedLessonAccess: boolean;
    hasChefChatService: boolean;
    permanent5PercentDiscount: boolean;
    freeDeliveryInPickupPoints: boolean;
    hasKitchenSpaceRentalService: boolean;
    exclusiveEventInvitations: boolean;
    hasReferralRewards: boolean;
    referralBonusOnlyForPaidSubscriptions: boolean;
    annualSubscriptionRenewalBonus: boolean;
  };
}

export const subscriptions: CookMasterSubscription[] = [
  {
    displayedName: "Starter Subscription",
    productName: "subStarter",
    subscriptionLevel: 1,
    price: 9.9,
    benefits: {
      noAds: true,
      canComment: true,
      accessLimitedToOneLessonPerDay: false,
      accessLimitedToFiveLessonsPerDay: true,
      unlimitedLessonAccess: false,
      hasChefChatService: true,
      permanent5PercentDiscount: true,
      freeDeliveryInPickupPoints: true,
      hasKitchenSpaceRentalService: false,
      exclusiveEventInvitations: true,
      hasReferralRewards: true,
      referralBonusOnlyForPaidSubscriptions: false,
      annualSubscriptionRenewalBonus: false,
    },
  },
  {
    displayedName: "Master Subscription",
    productName: "subMaster",
    subscriptionLevel: 2,
    price: 19,
    benefits: {
      noAds: true,
      canComment: true,
      accessLimitedToOneLessonPerDay: false,
      accessLimitedToFiveLessonsPerDay: false,
      unlimitedLessonAccess: true,
      hasChefChatService: true,
      permanent5PercentDiscount: true,
      freeDeliveryInPickupPoints: true,
      hasKitchenSpaceRentalService: true,
      exclusiveEventInvitations: true,
      hasReferralRewards: true,
      referralBonusOnlyForPaidSubscriptions: true,
      annualSubscriptionRenewalBonus: true,
    },
  },
  {
    displayedName: "Free Subscription",
    productName: "subFree",
    subscriptionLevel: 0,
    price: 0,
    benefits: {
      noAds: false,
      canComment: true,
      accessLimitedToOneLessonPerDay: true,
      accessLimitedToFiveLessonsPerDay: false,
      unlimitedLessonAccess: false,
      hasChefChatService: false,
      permanent5PercentDiscount: false,
      freeDeliveryInPickupPoints: true,
      hasKitchenSpaceRentalService: false,
      exclusiveEventInvitations: false,
      hasReferralRewards: false,
      referralBonusOnlyForPaidSubscriptions: false,
      annualSubscriptionRenewalBonus: false,
    },
  },
];
