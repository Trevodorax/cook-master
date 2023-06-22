import { useState } from "react";
import { toast } from "react-hot-toast";
import { useStripe } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";

import { SubscriptionCard } from "@/components/subscriptionCard/SubscriptionCard";
import { useCreateBillingIntentMutation } from "@/store/services/cookMaster/api";
import { RootState } from "@/store/store";

import { subscriptions } from "./utils/subscriptionTypes";
import styles from "./SubscriptionBooking.module.scss";
import { PaymentModal } from "@/components/paymentModal/PaymentModal";
import { Button } from "@/components/button/Button";

export const SubscriptionBooking = () => {
  const stripe = useStripe();

  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const userId = useSelector((state: RootState) => state.user.userInfo?.id);

  const [createBillingIntent, { isError: isBillingDataError }] =
    useCreateBillingIntentMutation();

  const handleBuyClick = async () => {
    if (!stripe) {
      toast.error("Stripe error");
      return;
    }

    const result = await createBillingIntent({
      productName: subscriptions[selectedCardIndex].productName,
      userId: userId || -1,
    });

    if (isBillingDataError) {
      toast.error("Could not get payment information");
      return;
    }

    if (!(result as { data: any }).data) {
      toast.error("Stripe error");
      return;
    }

    // if not error, then data exists, but typescript is dumb so I use "as"
    const clientSecret = (result as { data: any }).data.clientSecret;

    if (!clientSecret || typeof clientSecret !== "string") {
      toast.error("Could not get payment information");
      return;
    }

    setClientSecret(clientSecret);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <h1>Our formulas</h1>
      <div className={styles.payButtonZone}>
        <Button className={styles.payButton} onClick={handleBuyClick}>
          Buy
        </Button>
      </div>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        setIsOpen={setIsPaymentModalOpen}
        productName={subscriptions[selectedCardIndex].displayedName}
        productPrice={subscriptions[selectedCardIndex].price}
        clientSecret={clientSecret}
        successRedirection="/dashboard"
        successMessage={`Thank you for purchasing the ${subscriptions[selectedCardIndex].displayedName} subscription.`}
      />
      <div className={styles.cards}>
        {subscriptions.map((subscription, index) => (
          <SubscriptionCard
            isSelected={index === selectedCardIndex}
            subscription={subscription}
            onClick={() => setSelectedCardIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};
