import { ChangeEventHandler, FC, useState } from "react";
import { toast } from "react-hot-toast";

import { Props } from "../types";
import { SetterWrapper } from "../setterWrapper/SetterWrapper";

import styles from "./ImageSetter.module.scss";

export const ImageSetter: FC<Props> = ({
  initialValue,
  setIsOpen,
  mutateValue,
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      toast.error("Please provide an image.");
      return;
    }

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const img = new Image();
      img.src = reader.result as string;

      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      let { width, height } = img;

      if (width > height) {
        if (width > 500) {
          height *= 500 / width;
          width = 500;
        }
      } else {
        if (height > 500) {
          width *= 500 / height;
          height = 500;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL("image/jpeg");
      setValue(dataUrl);
    };

    reader.readAsDataURL(file);
  };

  return (
    <SetterWrapper
      value={value}
      mutateValue={mutateValue}
      setIsOpen={setIsOpen}
    >
      <input type="file" accept="image/jpeg" onChange={handleChange} />
      {value && (
        <img className={styles.imagePreview} src={value} alt="preview" />
      )}
    </SetterWrapper>
  );
};
