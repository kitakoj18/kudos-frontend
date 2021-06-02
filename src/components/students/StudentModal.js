import React, { useState, useRef } from "react";
import Modal from "react-modal";

import { gql, useMutation } from "@apollo/client";

import Input from "../forms/Input";
import Button from "../elements/Button";

import { checkValidity } from "../../utils/formValidity";
import { generateImageBase64, postImage } from '../../utils/image';

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
//Modal.setAppElement('#yourAppElement')

const StudentModal = (props) => {
  const [form, setForm] = useState({
    username: {
      inputType: "input",
      labelConfig: {
        display: false,
        label: "Username",
      },
      config: {
        type: "text",
        placeholder: "Username",
      },
      helper: "Username",
      value: props.username,
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    firstName: {
      inputType: "input",
      labelConfig: {
        display: false,
        label: "FirstName",
      },
      config: {
        type: "text",
        placeholder: "First Name",
      },
      helper: "First Name",
      value: props.firstName,
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    lastName: {
      inputType: "input",
      labelConfig: {
        display: false,
        label: "LastName",
      },
      config: {
        type: "text",
        placeholder: "Last Name",
      },
      helper: "Last Name",
      value: props.lastName,
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    password: {
      inputType: "input",
      labelConfig: {
        display: false,
        label: "Password",
      },
      config: {
        type: "password",
        placeholder: "Password",
      },
      helper: "",
      value: "",
      validation: {
        required: false,
      },
      valid: false,
      touched: false,
    },
  });

  const [formIsValid, setFormIsValid] = useState(false);

  const [imagePreview, setImagePreview] = useState(null)
  const [imagePath, setImagePath] = useState(null)
  const inputFile = useRef(null)

  let STUDENT;
  if (props.addStudent) {
    STUDENT = gql`
      mutation postCreateStudent(
        $firstName: String!
        $lastName: String!
        $username: String!
        $password: String!
        $imageUrl: String!
        $classId: Int!
      ) {
        createStudent(
          studentInput: {
            firstName: $firstName
            lastName: $lastName
            username: $username
            password: $password
            imageUrl: $imageUrl
            classId: $classId
          }
        ) {
          id
        }
      }
    `;
  } else {
    STUDENT = gql`
      mutation postEditStudent(
        $id: Int!
        $firstName: String!
        $lastName: String!
        $username: String!
        $password: String!
      ) {
        editStudent(
          studentInput: {
            id: $id
            firstName: $firstName
            lastName: $lastName
            username: $username
            password: $password
          }
        ) {
          id
        }
      }
    `;
  }

  const [student] = useMutation(STUDENT, {
    onCompleted() {
      props.refreshData();
    },
    onError() {
      console.log("error editing student");
    },
  });

  const DELETE = gql`
    mutation deleteStudent($id: Int!) {
      deleteStudents(studentInput: { studentIds: [$id] }) {
        id
      }
    }
  `;

  const [deleteStudent] = useMutation(DELETE, {
    onCompleted() {
      props.refreshData();
    },
    onError() {
      console.log("unable to delete student!");
    },
  });

  const inputChangeHandler = (event, inputIdentifier) => {
    const updatedForm = { ...form };
    const updatedFormInput = { ...updatedForm[inputIdentifier] };
    updatedFormInput.value = event.target.value;
    updatedFormInput.valid = checkValidity(
      updatedFormInput.value,
      updatedFormInput.validation
    );
    updatedFormInput.touched = true;
    updatedForm[inputIdentifier] = updatedFormInput;

    let formIsValid = true;
    for (let inputIdentifier in updatedForm) {
      formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
    }

    setForm(updatedForm);
    setFormIsValid(formIsValid);
  };

  const openImageFilePicker = (event) => {
    event.preventDefault()
    inputFile.current.click()
  }

  const selectImageHandler = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    generateImageBase64(file)
      .then(b64 => {
        setImagePreview(b64)
        setImagePath(file)
      })
      .catch(err => console.log(err))
  }

  const submitStudentHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData()
    formData.append('image', imagePath)
    const responseData = await postImage(formData)
    const imageUrl = await responseData.filePath

    student({
      variables: {
        id: props.id ? props.id : "",
        classId: props.classId ? props.classId : "",
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        username: form.username.value,
        password: form.password.value,
        imageUrl: imageUrl ? imageUrl : "undefined"
      },
    });
    props.onClose();
  };

  const deleteStudentHandler = async (event) => {
    event.preventDefault();
    deleteStudent({
      variables: {
        id: props.id ? props.id : "",
      },
    });
  };

  const formInputArray = [];
  for (let key in form) {
    formInputArray.push({
      id: key,
      config: form[key],
    });
  }

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onClose}
      style={customStyles}
    >
      <p>
        {props.addStudent
          ? "Add a new student"
          : props.firstName + " " + props.lastName}
      </p>
      <form className="form" onSubmit={submitStudentHandler}>
        <div 
          className="form__image"
          style={{
            backgroundImage: `url('${imagePreview}')`
          }}
        >
          <button className="form__image-btn" onClick={openImageFilePicker}>Upload/Edit</button> 
        </div>

        <input 
          type='file'
          ref={inputFile}
          style={{ display: 'none' }}
          onChange={selectImageHandler}
        />

        {formInputArray.map((formInput) => (
          <Input
            key={formInput.id}
            inputType={formInput.config.inputType}
            inputConfig={formInput.config.config}
            value={formInput.config.value}
            labelConfig={formInput.config.labelConfig}
            helper={formInput.config.helper}
            isValid={!formInput.config.valid}
            shouldValidate={formInput.config.validation}
            touched={formInput.config.touched}
            changed={(event) => inputChangeHandler(event, formInput.id)}
          />
        ))}

        <Button btnColor="green" disabled={!formIsValid}>
          {props.addStudent ? "Add" : "Update"}
        </Button>
      </form>

      {!props.addStudent ? (
        <Button btnColor="green" clicked={deleteStudentHandler}>
          Delete Student
        </Button>
      ) : null}
    </Modal>
  );
};

export default StudentModal;
