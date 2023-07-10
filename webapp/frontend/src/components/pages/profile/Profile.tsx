import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

import { SubscriptionLevelIcon } from "@/components/svgs";
import { EditableField } from "@/components/editableField/EditableField";
import {
  useGetMeMutation,
  usePatchMeMutation,
  useUpdateMyAddressMutation,
} from "@/store/services/cookMaster/api";
import { TextInput } from "@/components/textInput/TextInput";
import { Button } from "@/components/button/Button";

import styles from "./Profile.module.scss";
import { SelectInput } from "@/components/selectInput/SelectInput";
import { possibleLocales } from "@/store/services/cookMaster/constants";
import { useTranslation } from "react-i18next";

export const Profile: FC = () => {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const [patchMe] = usePatchMeMutation();
  const [getMe, { data: userData }] = useGetMeMutation();
  const [updateMyAddress] = useUpdateMyAddressMutation();

  // the deadline is near, this is a really disgusting pattern, but I have no time to find better
  const patch = (value: any) => {
    patchMe(value);
    getMe();
  };

  // fetch user data on load
  useEffect(() => {
    getMe();
  }, []);

  // update the address when user data changes
  useEffect(() => {
    if (userData?.locale) {
      setLocale(userData.locale);
    }
    if (userData?.client?.Address) {
      setAddress(userData.client.Address);
    }
  }, [userData]);

  const [address, setAddress] = useState({
    streetNumber: userData?.client?.Address?.streetNumber || "",
    streetName: userData?.client?.Address?.streetName || "",
    city: userData?.client?.Address?.city || "",
    postalCode: userData?.client?.Address?.postalCode || "",
    country: userData?.client?.Address?.country || "",
  });

  const [locale, setLocale] = useState(userData?.locale || "");

  const handleUpdateAddress = async () => {
    const response = await updateMyAddress(address);

    if ("data" in response) {
      getMe();
    } else {
      toast.error(t("errorUpdatingAddress"));
    }
  };

  const handleSetLocale = (locale: string) => {
    i18n.changeLanguage(locale);
    patch({ data: { locale: locale } });
    setLocale(locale);
  };

  const subscriptionLevelString =
    userData?.client?.subscriptionLevel === 0
      ? "free"
      : userData?.client?.subscriptionLevel === 1
      ? "standard"
      : "expert";

  return (
    <div className={styles.container}>
      {userData?.userType === "client" && (
        <div
          title={subscriptionLevelString + " plan"}
          onClick={() => router.push("subscription/booking")}
          className={styles.subscriptionLevel}
        >
          <SubscriptionLevelIcon
            subscriptionLevel={userData.client?.subscriptionLevel || 0}
          />
        </div>
      )}
      <EditableField
        type="image"
        initialValue={userData?.profilePicture}
        mutateValue={(value) => {
          patch({ data: { profilePicture: value } });
        }}
        isEditable={true}
      />
      <EditableField
        type="text"
        initialValue={<p>{userData?.firstName}</p>}
        mutateValue={(value) => {
          patch({ data: { firstName: value } });
        }}
        isEditable={true}
      />
      <EditableField
        type="text"
        initialValue={<p>{userData?.lastName}</p>}
        mutateValue={(value) => {
          patch({ data: { lastName: value } });
        }}
        isEditable={true}
      />
      <p title={userData?.userType}>
        {userData?.userType === "contractor"
          ? "👨‍🍳"
          : userData?.userType === "client"
          ? "👨‍🎓"
          : "👁️"}
      </p>
      <SelectInput
        className={styles.localeSelectInput}
        options={possibleLocales}
        value={locale}
        setValue={(value) => handleSetLocale(value)}
        defaultIndex={possibleLocales.indexOf(locale)}
      />

      {userData?.userType === "client" && (
        <div>
          <h3>{t("address")}</h3>
          <div className={styles.form}>
            <TextInput
              type="text"
              value={address.streetNumber}
              setValue={(value) =>
                setAddress((prev) => ({ ...prev, streetNumber: value }))
              }
              label={t("streetNumber")}
              className={styles.textInput}
              hideIcon
            />

            <TextInput
              type="text"
              value={address.streetName}
              setValue={(value) =>
                setAddress((prev) => ({ ...prev, streetName: value }))
              }
              label={t("streetName")}
              className={styles.textInput}
              hideIcon
            />

            <TextInput
              type="text"
              value={address.city}
              setValue={(value) =>
                setAddress((prev) => ({ ...prev, city: value }))
              }
              label={t("city")}
              className={styles.textInput}
              hideIcon
            />

            <TextInput
              type="text"
              value={address.postalCode}
              setValue={(value) =>
                setAddress((prev) => ({ ...prev, postalCode: value }))
              }
              label={t("postalCode")}
              className={styles.textInput}
              hideIcon
            />

            <TextInput
              type="text"
              value={address.country}
              setValue={(value) =>
                setAddress((prev) => ({ ...prev, country: value }))
              }
              label={t("country")}
              className={styles.textInput}
              hideIcon
            />
            <Button
              className={styles.createButton}
              onClick={handleUpdateAddress}
            >
              {t("updateAddress")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
