import {
  useGetAllUsersQuery,
  useGetEventByIdQuery,
  usePatchUserMutation,
} from "@/store/services/cookMaster/api";
import styles from "./Event.module.scss";
import { Modal } from "@/components/modal/Modal";
import { useState } from "react";
import { ModificationModal } from "@/components/modificationModal/ModificationModal";

interface Props {
  eventId: string;
}

export const Event = ({ eventId }: Props) => {
  const [modalContent, setModalContent] = useState(<div />);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!eventId) {
    return <div>Event not found</div>;
  }

  const { data: event, isLoading, isError } = useGetEventByIdQuery(eventId);

  const handleTitleClick = () => {
    setModalContent(<div>Modify title</div>);
    setIsModalOpen(true);
  };

  const handleTypeClick = () => {
    setModalContent(<div>Modify type</div>);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !event) {
    return <div>An error occured.</div>;
  }

  return (
    <div className={styles.container}>
      {/* TODO: Create a better format for it, with modification buttons onlyh on the fields the user can modify  */}{" "}
      {/* TODO: Implement a general modification modal for modificating fields (with a modification request, a field, its type and the initial value) */}
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        {modalContent}
      </Modal>
      <ModificationModal
        type="text"
        initialValue="initial value"
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        useMutation={usePatchUserMutation}
        useFetchPossibleValues={useGetAllUsersQuery}
      />
      <button onClick={() => setIsModalOpen(true)}>Open modal</button>
      <h2 onClick={handleTitleClick}>{event.name}</h2>
      <p onClick={handleTypeClick}>Type: {event.type}</p>
      <p>Description: {event.description}</p>
      <p>Date: {event.startTime.toUTCString()}</p>
      <p>Duration: {event.durationMin} minutes</p>
      <p>Animator: {event.animator?.id || "None"}</p>
    </div>
  );
};

// TODO: create the modification modals for each of these fields
