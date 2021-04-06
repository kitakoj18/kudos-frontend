import React, { Component } from "react";
import { navigate } from "gatsby";
import Input from "../forms/Input";
import Button from "../elements/Button";

class Login extends Component {
  state = {
    loginError: false,
    form: {
      firstName: {
        inputType: "",
        labelConfig: {
          display: false,
          label: "First Name",
        },
        config: {
          type: "text",
          placeholder: "First Name",
        },
        helper: "Enter first name",
        value: "",
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
          label: "Last Name",
        },
        config: {
          type: "text",
          placeholder: "Last Name",
        },
        helper: "Enter last name",
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
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
        value: "",
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
        helper: "Password must be 8 characters long.",
        value: "",
        validation: {
          required: false,
        },
        valid: false,
        touched: false,
      },
      confirmPassword: {
        inputType: "input",
        labelConfig: {
          display: false,
          label: "Confirm Password",
        },
        config: {
          type: "password",
          placeholder: "Reenter Password",
        },
        helper: "Reenter Password",
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
    },
    formIsValid: false,
    loading: false,
  };

  checkValidity = (value, rules) => {
    if (!rules) {
      return true;
    }
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }
    return isValid;
  };

  inputChangeHandler = (event, inputIdentifier) => {
    const updatedForm = { ...this.state.form };
    const updatedFormInput = { ...updatedForm[inputIdentifier] };
    updatedFormInput.value = event.target.value;
    updatedFormInput.valid = this.checkValidity(
      updatedFormInput.value,
      updatedFormInput.validation
    );
    updatedFormInput.touched = true;
    updatedForm[inputIdentifier] = updatedFormInput;

    let formIsValid = true;
    for (let inputIdentifier in updatedForm) {
      formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
    }

    this.setState({
      form: updatedForm,
      formIsValid: formIsValid,
    });
  };

  loginSubmitHandler = async (event) => {
    event.preventDefault();
    let loginValues = {
      username: this.state.form.username.value,
      password: this.state.form.password.value,
    };
  };

  render() {
    const formInputArray = [];
    for (let key in this.state.form) {
      formInputArray.push({
        id: key,
        config: this.state.form[key],
      });
    }
    let display;

    if (!this.state.loginError) {
      display = (
        <form
          method="POST"
          onSubmit={async (event) => {
            await this.loginSubmitHandler(event);
          }}
          className="form"
          id="example-form"
        >
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
              changed={(event) => this.inputChangeHandler(event, formInput.id)}
              pointsHandler={this.pointsIncrementHandler}
            />
          ))}
          <Button btnColor="green" disabled={!this.state.formIsValid}>
            Register
          </Button>
        </form>
      );
    } else {
      display = (
        <div>
          <h1>An error occurred...</h1>
        </div>
      );
    }
    return <div className="form-container">{display}</div>;
  }
}

export default Login;