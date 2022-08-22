import formValidator from "./formValidator";

export default (e, formData) => {
    const changedInput = e.target.closest('.InputElement');
    if(!changedInput) return;
    const updatedInputKey = changedInput.dataset.key;
    const updatedFormData = {
        ...formData
    }

    const updatedFormElement = {
        ...updatedFormData[updatedInputKey]
    };

    updatedFormElement.value = e.target.value;
    updatedFormElement.touched = true;
    updatedFormElement.valid = formValidator(updatedFormElement.value, updatedFormElement.validation);
    updatedFormData[updatedInputKey] = updatedFormElement;
    let formIsValid = true;
    for(let inputKey in updatedFormData) {
        formIsValid = updatedFormData[inputKey].valid && formIsValid;
    }
    return {formIsValid, updatedFormData};
}