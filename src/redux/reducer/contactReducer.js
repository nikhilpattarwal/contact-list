import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  contacts: [],
};

// get data from api
export const usersList = createAsyncThunk("ADD/newUsersList", async () => {
  try {
    const data = await axios.get("https://jsonplaceholder.typicode.com/users");
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
});

// post data to api (dummy call)
export const addContact = createAsyncThunk(
  "ADD/newContact",
  async (contactData) => {
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/users",
        {
          name: contactData.name,
          phone: contactData.phone,
          // id: contactData.id,
        }
      );
      console.log("response", response);
      return {...response.data, id: contactData.id };
    } catch (e) {
      console.log(e);
    }
  }
);


// update data in api (dummy call)
export const updateContact = createAsyncThunk(
  "UPDATE/updateContact",
  async (contactData) => {
    console.log("reducer updated contact", contactData);

      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/users/${contactData.id}`,
        {
          name: contactData.name,
          phone: contactData.phone,
          id: contactData.id,
        }
      );

      return response;
   
  }
);

// delete data from api (dummy call)
export const deleteContact = createAsyncThunk(
  "DELETE/deleteContact",
  async (contactId) => {
    console.log("id", contactId);
 
      const response = await axios.delete(
        `https://jsonplaceholder.typicode.com/users/${contactId}`,
        () => {
          console.log(response);
        }
      );
      return contactId;
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    //update method for new created contacts
    UPDATE: (state, action) => {
      console.log("Normal update Reducer data", action.payload);
      const updatedContact = action.payload;
      state.contacts = state.contacts.map((contact) =>
        contact.id === updatedContact.id ? updatedContact : contact
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(usersList.fulfilled, (state, action) => {
        state.contacts = action.payload.data;
        console.log("Current state", state);
      })
      .addCase(addContact.fulfilled, (state, action) => {
        console.log("reducer name data new", action.payload);
        state.contacts.unshift(action.payload);
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        console.log("reducer name data new", action.payload.data);
        const updatedContact = action.payload.data;
        state.contacts = state.contacts.map((contact) =>
          contact.id === updatedContact.id ? updatedContact : contact
        );
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        const contactId = action.payload;
        const id = state.contacts.findIndex(
          (contact) => contact.id === contactId
        );
        if (id !== -1) {
          state.contacts.splice(id, 1);
        }
      });
  },
});

export const contactReducer = contactSlice.reducer;
export const contactSelector = (state) => state.contactReducer;
export const contactActions = contactSlice.actions;