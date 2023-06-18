import { FC, FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

import { Modal } from "@/components/modal/Modal";

import styles from "./PaymentModal.module.scss";
import { Button } from "../button/Button";
import { useRouter } from "next/router";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  productName: string;
  productPrice: number;
  clientSecret: string;
  successRedirection: string;
  successMessage: string;
}

export const PaymentModal: FC<Props> = ({
  isOpen,
  setIsOpen,
  productName,
  productPrice,
  clientSecret,
  successRedirection,
  successMessage,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [hasPaymentSucceeded, setHasPaymentSucceeded] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe error");
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      toast.error("Credit card error");
      return;
    }

    if (typeof clientSecret !== "string") {
      toast.error("Could not get payment information");
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: "Michal Sardon",
        },
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      setHasPaymentSucceeded(true);
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      {!hasPaymentSucceeded ? (
        <div className={styles.container}>
          <div className={styles.productInfo}>
            <div className={styles.productName}>{productName}</div>
            <div className={styles.productPrice}>{`${productPrice.toFixed(
              2
            )} €`}</div>
          </div>
          <form className={styles.cardForm} onSubmit={handleSubmit}>
            <CardElement />
          </form>
        </div>
      ) : (
        <div className={styles.container}>
          {successMessage}
          <div>
            <Button
              className={styles.okButton}
              type="ok"
              onClick={() => router.push(successRedirection)}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
