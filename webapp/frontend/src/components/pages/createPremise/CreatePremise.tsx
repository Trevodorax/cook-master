import { TextInput } from "@/components/textInput/TextInput";
import styles from "./CreatePremise.module.scss";
import { useState } from "react";
import { useCreatePremiseMutation } from "@/store/services/cookMaster/api";
import { Button } from "@/components/button/Button";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

export const CreatePremise = () => {
  const router = useRouter();

  const [createPremise] = useCreatePremiseMutation();
  const [address, setAddress] = useState({
    streetNumber: "",
    streetName: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleCreate = async () => {
    const response = await createPremise(address);

    if ("data" in response) {
      router.push(`/premises/${response.data.id}`);
    } else {
      toast.error("Error creating premise");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create premise</h1>
      <hr />
      <div className={styles.form}>
        <TextInput
          type="text"
          value={address.streetNumber}
          setValue={(value) =>
            setAddress((prev) => ({ ...prev, streetNumber: value }))
          }
          label="Street number"
          hideIcon
          className={styles.input}
        />

        <TextInput
          type="text"
          value={address.streetName}
          setValue={(value) =>
            setAddress((prev) => ({ ...prev, streetName: value }))
          }
          label="Street name"
          hideIcon
          className={styles.input}
        />

        <TextInput
          type="text"
          value={address.city}
          setValue={(value) => setAddress((prev) => ({ ...prev, city: value }))}
          label="City"
          hideIcon
          className={styles.input}
        />

        <TextInput
          type="text"
          value={address.postalCode}
          setValue={(value) =>
            setAddress((prev) => ({ ...prev, postalCode: value }))
          }
          label="Postal code"
          hideIcon
          className={styles.input}
        />

        <TextInput
          type="text"
          value={address.country}
          setValue={(value) =>
            setAddress((prev) => ({ ...prev, country: value }))
          }
          label="Country"
          hideIcon
          className={styles.input}
        />
        <Button className={styles.createButton} onClick={handleCreate}>
          Create premise
        </Button>
      </div>
    </div>
  );
};
