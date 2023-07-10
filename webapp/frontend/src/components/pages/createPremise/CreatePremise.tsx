import { TextInput } from "@/components/textInput/TextInput";
import styles from "./CreatePremise.module.scss";
import { useState } from "react";
import { useCreatePremiseMutation } from "@/store/services/cookMaster/api";
import { Button } from "@/components/button/Button";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

export const CreatePremise = () => {
  const { t } = useTranslation();
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
      <h1>{t("createPremise")}</h1>
      <hr />
      <div className={styles.form}>
        <TextInput
          type="text"
          value={address.streetNumber}
          setValue={(value) =>
            setAddress((prev) => ({ ...prev, streetNumber: value }))
          }
          label={t("streetNumber")}
          hideIcon
          className={styles.input}
        />

        <TextInput
          type="text"
          value={address.streetName}
          setValue={(value) =>
            setAddress((prev) => ({ ...prev, streetName: value }))
          }
          label={t("streetName")}
          hideIcon
          className={styles.input}
        />

        <TextInput
          type="text"
          value={address.city}
          setValue={(value) => setAddress((prev) => ({ ...prev, city: value }))}
          label={t("city")}
          hideIcon
          className={styles.input}
        />

        <TextInput
          type="text"
          value={address.postalCode}
          setValue={(value) =>
            setAddress((prev) => ({ ...prev, postalCode: value }))
          }
          label={t("postalCode")}
          hideIcon
          className={styles.input}
        />

        <TextInput
          type="text"
          value={address.country}
          setValue={(value) =>
            setAddress((prev) => ({ ...prev, country: value }))
          }
          label={t("country")}
          hideIcon
          className={styles.input}
        />
        <Button className={styles.createButton} onClick={handleCreate}>
          {t("createPremise")}
        </Button>
      </div>
    </div>
  );
};
