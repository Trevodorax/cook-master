import styles from "./SwitchInput.module.scss";

interface Props {
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
}

export const SwitchInput = ({ isChecked, setIsChecked }: Props) => {
  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className={styles.container}>
      <label className={styles.switch}>
        <input type="checkbox" checked={isChecked} onChange={handleChange} />
        <span className={styles.slider} />
      </label>
    </div>
  );
};
