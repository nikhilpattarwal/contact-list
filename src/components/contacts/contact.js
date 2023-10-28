import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { addContact, contactSelector, updateContact, usersList } from "../../redux/reducer/contactReducer";
import styles from "./contact.module.css"
import { IoTrash } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { FcPlus } from "react-icons/fc"
import { FaCheck } from "react-icons/fa"
import { deleteContact } from "../../redux/reducer/contactReducer";
import { LiaMehBlank } from "react-icons/lia";
import { contactActions } from "../../redux/reducer/contactReducer";
import { toast } from "react-toastify";
import { MdArrowBackIosNew } from "react-icons/md"

export const Contact = () => {
  const [inputVal, setInputVal] = useState({ name: "", phone: "", id: "" });
  const [handleForm, sethandleForm] = useState(false);
  const [editContactId, setEditContactId] = useState(null);
  const dispatch = useDispatch();
  const { contacts } = useSelector(contactSelector);

  // dispatch api user's list
  useEffect(() => {
    dispatch(usersList());
  }, [dispatch])

  const handleAdd = () => {
    sethandleForm(handleForm ^ true);
  }

  // function to add new contact
  const handleAddContact = async () => {
    try {
      if (inputVal.name.trim() !== "" && inputVal.phone.trim() !== "") {
        dispatch(addContact({ ...inputVal, id: new Date().getTime().toString() }));
        sethandleForm(false);
        setInputVal({
          name: "",
          phone: "",
          id: "",
        });
        toast.success("Contact added successfully");
      } else {
        toast.error("Please enter a name and phone number");
      }
    } catch (error) {
      toast.error("An error occurred while adding the contact");
    }
  };

  // function to edit contact
  const handleEdit = (contactId) => {
    setEditContactId((prevEditContactId) => (prevEditContactId === contactId ? null : contactId));
    const selectedContact = contacts.find((user) => user.id === contactId);
    if (selectedContact) {
      setInputVal({
        name: selectedContact.name,
        phone: selectedContact.phone,
        id: selectedContact.id,
      });
    }
  };

  //function to toggle edit button
  const isEditDisabled = (contactId) => {
    return editContactId !== contactId;
  };

    //function to save edited contact
  const handleSave = (id) => {
    try {
      if (id <= 10) {
        dispatch(updateContact(inputVal));
      } else {
        dispatch(contactActions.UPDATE(inputVal));
      }
      toast.success("Contact Updated Successfully");
      handleEdit(id);
      isEditDisabled(id);
    } catch (error) {
      toast.error("An error occurred while updating the contact");
    }
  };

    //function to delete contact
  const handleDelete = (id) => {
    try {
      dispatch(deleteContact(id));
      // Show a success toast for successful contact deletion
      toast.success("Contact Deleted Successfully");
    } catch (error) {
      toast.error("Error in deleting contact");
    }
  };

  return (
    <>

      <div className={styles.mainContainer}>
        <div className={styles.innerContainer}>
          <div className={styles.headingIcon}>
            <h2>Contact List</h2>
           <div className={styles.plusIcon} onClick={() => handleAdd()}>{handleForm?<MdArrowBackIosNew/>:<FcPlus />}</div> 
          </div>
          {contacts.length !== 0 ? (
            !handleForm ? (
              contacts.map((user, i) => (
                <div key={i} className={styles.contactContainer}>
                  <div className={styles.nameAndPhone}>
                    <input
                      className={styles.nameInput}
                      type="text"
                      value={editContactId === null ? user.name : null}
                      disabled={isEditDisabled(user.id)}
                      autoFocus={true}
                      onChange={(e) => setInputVal({ ...inputVal, name: e.target.value, id: user.id })}
                    />

                    <input
                      className={styles.nameInput}
                      type="text"
                      value={editContactId === null ? user.phone :null}
                      disabled={isEditDisabled(user.id)}
                      autoFocus
                      onChange={(e) => setInputVal({ ...inputVal, phone: e.target.value })}
                    />
                  </div>
                  <div className={styles.information}>
                    <p onClick={() => handleDelete(user.id)}><IoTrash style={{ color: 'red' }} /></p>
                    <p onClick={() => handleEdit(user.id)}><MdEdit style={{ color: 'blue' }} /></p>
                    <p onClick={() => handleSave(user.id)}>{editContactId === user.id ? <FaCheck style={{ color: 'green' }} /> : null}</p>
                  </div>
                </div>
              ))
            ) : ""
          ) : (
            <LiaMehBlank className={styles.emoji} />
          )}

          {/* form ro get user input to create a new contact */}
          {handleForm &&
            <div className={styles.formContainer}>
              <div className={styles.inputs}>
                <input type="text" placeholder="Name" onChange={(e) => setInputVal({ ...inputVal, name: e.target.value })} />
                <input type="text" placeholder="Contact" onChange={(e) => setInputVal({ ...inputVal, phone: e.target.value })} />
                <button onClick={() => handleAddContact()} className={styles.button}>Add Contact</button>
              </div>
            </div>
          }

        </div>
      </div>
    </>
  )
}